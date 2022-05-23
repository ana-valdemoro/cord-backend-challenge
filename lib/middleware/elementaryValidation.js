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
 * @param {*} expectedType 
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
 * @returns {boolean} indicates if request contains extraneous parameters or not
 */
export const checkExtraneousParams = (keysFromRules, keysFromRequest) => {
  const difference = keysFromRequest.filter(
    (param) => !keysFromRules.includes(param)
  );

  return difference.length !== 0;
};
