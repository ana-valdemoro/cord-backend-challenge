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
 * @param {*} keysFromRules array keys from rules
 * @param {*} keysFromRequest array keys from request
 * @returns {Array} containing extraneous keys found in the request
 */
export const detectExtraneousParams = (keysFromRules, keysFromRequest) => {
  const extraneousKeys = keysFromRequest.filter(
    (param) => !keysFromRules.includes(param)
  );

  return extraneousKeys;
};
