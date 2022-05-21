const validateBodyParameters = (requestBody, rulesSchema) => {
  const requestDataKeys = Object.keys(requestBody);

  //Check body type and not empty
  if (typeof requestBody !== rulesSchema.type || requestDataKeys < 1) {
    return false;
  }

  //Check required params
  const { required: rulesRequiredParams } = rulesSchema;
  if (
    rulesRequiredParams &&
    checkRequiredParams(rulesRequiredParams, requestDataKeys) === false
  ) {
    return {
      passValidation: false,
      status: 422,
      message: "Missing required parameters",
    };
  }

  //Check strange params in request
  const permittedRulesParameters = Object.keys(rulesSchema.properties);

  if (checkExtraneousParams(permittedRulesParameters, requestDataKeys)) {
    return {
      passValidation: false,
      status: 422,
      message: "Unknown params in request body",
    };
  }

  //Check paramterers typeof
  const requestDataArr = Object.entries(requestBody);
  const rulesProperties = rulesSchema.properties;
  console.log(requestDataArr);
  console.log(rulesProperties);

  if (checkParametersTypeOf(requestDataArr, rulesProperties) === false) {
    return {
      passValidation: false,
      status: 422,
      message: "The parameters do not comply with the typing",
    };
  }

  return { passValidation: true };
};

const checkRequiredParams = (reqFromRules, requestParams) =>
  reqFromRules.every((requiredParam) => requestParams.includes(requiredParam));

const checkExtraneousParams = (propFromRules, requestParams) => {
  let difference = requestParams.filter(
    (param) => !propFromRules.includes(param)
  );

  return difference.length !== 0;
};

const checkParametersTypeOf = (requestDataArr, rulesProperties) => {
  //Loop request data array
  for (let requestParam of requestDataArr) {
    let [key, value] = requestParam;
    let type = rulesProperties[key].type;

    //Number
    if (type === "integer") {
      if (!isInteger(value)) {
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

const isInteger = (value) => Number.isInteger(value);

export default validateBodyParameters;
