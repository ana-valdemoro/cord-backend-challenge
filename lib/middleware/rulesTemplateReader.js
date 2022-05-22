import fs from 'fs';

const rules = JSON.parse(fs.readFileSync(`${__dirname}/rules.json`, 'utf8'));

export default (params) => {
  const { route } = params;
  const { paths } = rules;
  const method = params.method.toLowerCase();

  const routeFound = Object.entries(paths).find(
    (validationRoute) => validationRoute[0] === route
  );

  if (!routeFound || routeFound.length < 1) {
    return {};
  }

  //Same route can belong to more than one http methods
  const methods = Object.entries(routeFound[1]);
  const foundMethod = methods.find(
    (validationMethods) => validationMethods[0] === method
  );

  if (!foundMethod) {
    return {};
  }

  return { parameters: foundMethod[1].parameters };
};
