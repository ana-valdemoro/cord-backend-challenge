import { checkIntegerType, checkStringOrBooleanType } from './elementaryValidaton';

//Asumptions:
// 1. Query parameters are optional and we only check the intersection between rules and query inside the request.
// 2. Unknown query parameters are ignored for validation.

/**
 * 
 * @param {object} requestQuery current request query object to validate
 * @param {object} queryRules It is an array with a set of query rules to comply with
 * @returns {object} An object with following form:
 * {
 * "passQueryValidation": { boolean } indicates if requestValue fulfills the validation
 * "status" : { Number } Optional parameter,  http code in case of not passing the validation
 * "message" : { string } Optional parameter thrown in case of not passing the validation
 * } 
 */

const validateQueryParameters = (requestQuery, queryRules) => {
  const requestQueriesKeys = Object.keys(requestQuery);

  const queryRulesForCheckingTypes = queryRules.filter((rule) =>
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
 * @returns {object} with the following form: 
 * {
 * "passQueryValidation": { boolean } indicates if requestValue fulfills the validation
 * "errMessage" : { string } Optional parameter that is an error message in case of Array type
 * } 
  */
const checkQueryTypeOf = (requestValue, queryRule) => {
  const failedValidation = { passQueryValidation: false };

  if (queryRule.type === 'integer') {
    if (!checkIntegerType(requestValue)) return failedValidation;
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
    if (!checkStringOrBooleanType(requestValue, queryRule.type)) {
      return failedValidation;
    }
  }
  return { passQueryValidation: true };
};

/**
 * 
 * @param {*} value content of query parameter to check 
 * @param {*} queryRule 
 * @returns {boolean} indicates if pass array validation
 * @returns {object} when any element of the array doesn't match with array data type. 
 * It has the following form: 
 * { "errMessage" :{ string } Optional parameter that is an error message in case of Array type }
 * 
 */
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


export default validateQueryParameters;
