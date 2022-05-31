import {
  checkIntegerType,
  detectExtraneousParams,
  detectRequiredParams,
} from './elementaryValidation';
/**
 *
 * @param {object} requestBody represents current request body
 * @param {object} rulesSchema represents how should it be formed the request body
 * @returns {object} with the following form:
 * {
 * "passValidation" : {boolean} indicates if body cumplies with the validation
 * "status" : {Number} http code in case of not passing the validation
 * "message" : {object} array contains the appropriate validation failure message
 * }
 */
const validateBodyParameters = (requestBody, rulesSchema) => {
  let validationResult = { passValidation: true, message: [] };

  //Check body type
  if (typeof requestBody !== rulesSchema.type) {
    return {
      passValidation: false,
      status: 422,
      message: `Body data type is not ${rulesSchema.type}`,
    };
  }

  //Check required parameters
  const requestDataKeys = Object.keys(requestBody);
  const { required: rulesRequiredParams } = rulesSchema;

  if (rulesRequiredParams) {
    const existMissingRequiredParams = detectRequiredParams(
      requestDataKeys,
      rulesRequiredParams
    );
    if (existMissingRequiredParams.length !== 0) {
      validationResult.passValidation = false;
      validationResult.status = 422;
      validationResult.message.push(
        `Missing body required parameters. There are: ${existMissingRequiredParams.toString()}`
      );
    }
  }

  //Check strange parameters in request
  const permittedRulesParameters = Object.keys(rulesSchema.properties);
  const existExtraneousParameters = detectExtraneousParams(
    permittedRulesParameters,
    requestDataKeys
  );
  if (existExtraneousParameters.length !== 0) {
    validationResult.passValidation = false;
    validationResult.status = 422;
    validationResult.message.push(
      `Detected extraneous parameters in body. There are : ${existExtraneousParameters.toString()}`
    );
  }

  //Check parameters data type
  const rulesProperties = Object.entries(rulesSchema.properties);

  // Get rules for existing properties in body
  const bodyRulesForCheckingTypes = rulesProperties.filter((rule) =>
    requestDataKeys.includes(rule[0])
  );

  // Check body parameters data type
  if (bodyRulesForCheckingTypes.length >= 1) {
    for (let queryRule of bodyRulesForCheckingTypes) {
      const requestValue = requestBody[queryRule[0]];
      const { type: expectedType } = queryRule[1];
      const { passQueryValidation } = checkParametersTypeOf(
        requestValue,
        queryRule[1]
      );

      if (passQueryValidation === false) {
        let dataTypeErrorMessage = `${queryRule[0]} body parameter must be type of ${expectedType}`;
        validationResult.passValidation = false;
        validationResult.status = 422;
        validationResult.message.push(dataTypeErrorMessage);
      }
    }
  }

  return validationResult;
};

/**
 *
 * @param {*} requestValue value of the request body
 * @param {*} bodyRule an object with the following form:
 * {
 *    "type": {*}
 * }
 * @returns {boolean} indicates if the parameters fulfills its data type
 */
const checkParametersTypeOf = (requestValue, bodyRule) => {
  const failedValidation = { passQueryValidation: false };

  if (bodyRule.type === 'integer') {
    if (!checkIntegerType(requestValue)) {
      return failedValidation;
    }
  } else { 
    // Validate types boolean and string
    if (typeof requestValue !== bodyRule.type) {
      return failedValidation;
    }
  }

  return { passQueryValidation: true };
};

export default validateBodyParameters;
