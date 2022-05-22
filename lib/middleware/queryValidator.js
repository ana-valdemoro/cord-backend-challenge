const validateQueryParameters = (requestQuery, rulesQueries) => {
  const requestQueriesKeys = Object.keys(requestQuery);

  //Assume that query params are optional and we only check the
  //intersection between rules and query inside the request.

  const queryRulesForCheckingTypes = rulesQueries.filter((rule) =>
    requestQueriesKeys.includes(rule.name)
  );

  if (queryRulesForCheckingTypes.length >= 1) {
    for (let queryRule of queryRulesForCheckingTypes) {
      const requestValue = requestQuery[queryRule.name];
      const { type: expectedType } = queryRule;
      const { passQueryValidation, errMessage } = checkQueryTypeOf(
        requestValue,
        queryRule
      );

      if (passQueryValidation === false) {
        return {
          passQueryValidation,
          status: 422,
          message: errMessage
            ? errMessage
            : `${queryRule.name} query parameter must be type of ${expectedType}`,
        };
      }
    }

  }

  return { passQueryValidation: true };
};

/**
 * 
 * @param {*} requestValue value of the request parameter
 * @param {object} queryRule an object with the following form:
 * {
 *  "in": "Specifies if the parameter comes from body or from query",
 *  "name": "Parameter name",
 *  "type": "Data type of the parameter",
 *  "items": Optional property of array type parameter and it contains an object with following form:
 *      {"type": "Data type of array elements"},
 *  "description": "Description of the parameter"
}
 * @returns {boolean} Indicates if requestValue match with its expected data type
 */
const checkQueryTypeOf = (requestValue, queryRule) => {
  let failedValidation = { passQueryValidation: false };
  //Number
  if (queryRule.type === 'integer') {
    if (checkIntegerType(requestValue) === false) return failedValidation;
  } else if (queryRule.type === 'array') {
    const isArray = checkArrayType(requestValue, queryRule);
    if (isArray.errMessage) {
      return { ...isArray, ...failedValidation };
    }

    if (!isArray) {
      return failedValidation;
    }
  } else {
  
    // Validate types boolean and string
    if (!isNaN(requestValue)) return failedValidation;
    if (typeof requestValue !== queryRule.type) {
      return failedValidation;
    }
  }

  return { passQueryValidation: true };
};

const checkArrayType = (value, queryRule) => {
  //Check Array type
  if (!Array.isArray(value)) {
    return false;
  }
  //Check if all items in array match array typing
  const { items: arrayRules } = queryRule;
  const allItemsHaveSameType = value.every((item) =>{
    let { passQueryValidation } = checkQueryTypeOf(item, arrayRules);
    return passQueryValidation;
  }
  );

  if (!allItemsHaveSameType) {
    return {
      errMessage: `${queryRule.name} items data type of array mus be ${arrayRules.type} `,
    };
  }

  return true;
};

/**
 *
 * @param {*} value parameter that has the content to check data type
 * @returns {boolean} means if parameter is integer data type or not
 */
const checkIntegerType = (value) => {
  if (isNaN(value)) {
    return false;
  }
  //Being a number, checks if It is integer
  return Number.isInteger(Number(value));
};

export default validateQueryParameters;
