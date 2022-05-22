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
