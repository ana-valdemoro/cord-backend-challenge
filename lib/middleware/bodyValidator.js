import { checkIntegerType, checkExtraneousParams } from './elementaryValidation';
/**
 * 
 * @param {object} requestBody represents current request body
 * @param {object} rulesSchema represents how should it be formed the request body
 * @returns {object} with the following form:
 * {
 * "passValidation" : {boolean} indicates if body cumplies with the validation
 * "status" : {Number} http code in case of not passing the validation
 * "message" : {string} contains the appropriate validation failure message
 * }
 */
const validateBodyParameters = (requestBody, rulesSchema) => {
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
  if (
    rulesRequiredParams &&
    checkRequiredParams(requestDataKeys, rulesRequiredParams) === false
  ) {
    return {
      passValidation: false,
      status: 422,
      message: 'Missing body required parameters',
    };
  }

  //Check strange parameters in request
  const permittedRulesParameters = Object.keys(rulesSchema.properties);

  if (checkExtraneousParams(permittedRulesParameters, requestDataKeys)) {
    return {
      passValidation: false,
      status: 422,
      message: 'Unknown parameters in request body',
    };
  }

  //Check parameters data type
  const requestDataArr = Object.entries(requestBody);
  const rulesProperties = rulesSchema.properties;

  if (!checkParametersTypeOf(requestDataArr, rulesProperties)) {
    return {
      passValidation: false,
      status: 422,
      message: 'The parameters do not comply with the typing',
    };
  }

  return { passValidation: true };
};

/**
 * 
 * @param {*}  requestDataKeys array with the request body keys
 * @param {*} rulesRequiredParams array with the required name of parameters in rules
 * @returns {boolean} indicates if the body of request includes all required parameters
 */
const checkRequiredParams = ( requestDataKeys, rulesRequiredParams) =>
  rulesRequiredParams.every((requiredParam) =>  requestDataKeys.includes(requiredParam));

/**
 * 
 * @param {*} requestDataArr an array of arrays where each element has the following form:
 * ['propertyName', 'value']
 * @param {*} rulesProperties an object with the following form: 
 * {
 *    "propertyName": {object}
 * }
 * @returns {boolean} indicates if the parameters fulfills its data type
 */  
const checkParametersTypeOf = (requestDataArr, rulesProperties) => {
  //Loop request data array
  for (let requestParam of requestDataArr) {
    let [key, value] = requestParam;
    let type = rulesProperties[key].type;
    if (type === 'integer') {
      if (!checkIntegerType(value)){
        return false;
      } 

    } else {
      // Validate types boolean and string
      if (typeof value !== type) {
        return false;
      }
    }
  }

  return true;
};

export default validateBodyParameters;
