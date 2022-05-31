/**
 *
 * @param {*} value parameter that has the content to check data type
 * @returns {boolean} means if parameter is integer data type or not
 */
export const checkIntegerType = (value) => {
  if (isNaN(value)) {
    return false;
  }
  return Number.isInteger(Number(value));
};

/**
 *
 * @param {*} value parameter that has the content to check data type
 * @param {string} expectedType
 * @returns {boolean} means if parameter is string or boolean string data type or not
 */
export const checkStringOrBooleanType = (value, expectedType) => {
  if (!isNaN(value)) {
    return false;
  }
  return typeof value === expectedType;
};

/**
 *
 * @param {object} keysFromRules array keys from rules
 * @param {object} keysFromRequest array keys from request
 * @returns {object} array containing extraneous keys found in the request
 */
export const detectExtraneousParams = (keysFromRules, keysFromRequest) => {
  const extraneousKeys = keysFromRequest.filter(
    (param) => !keysFromRules.includes(param)
  );

  return extraneousKeys;
};

/**
 *
 * @param {object}  requestDataKeys array with the request body keys
 * @param {object} rulesRequiredParams array with the required name of parameters in rules
 * @returns {array} containing mising required parameters in body
 */
export const detectRequiredParams = (requestDataKeys, rulesRequiredParams) =>{
  const requiredKeys = rulesRequiredParams.filter(
    (param) => !requestDataKeys.includes(param)
  );

  return requiredKeys;
};
