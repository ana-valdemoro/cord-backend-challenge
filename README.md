# cord Backend Challenge

### Introduction 
Welcome! This coding challenge is designed to explore your backend skills. You will be writing an Express middleware function.

### The challenge
The developers at ASD corporation have built a new API. However the developers have forgotten to implement any request validation. 

The developers would like you to write a middleware function that checks all incoming requests against a set of predefined rules to ensure that the appropriate parameters have been supplied. The developers would prefer if you avoid installing additional packages, unless it is absolutely necessary. Validation should not be done via a 3rd party package. 

You will need to write some code to: 
1. Read the JSON file - `rules.json`
2. Improve the middleware function `checkAgainstRules` to check against the rules from step 1
3. (optional) Add some basic unit testing (1 positive and 1 negative case)

Ideally, the middleware will need to check for the following:
1. All required parameters are present
2. All parameter data types are correct (hint: type casting?)
3. No extraneous parameters are present

Also, there is a chance that the rules do not cover all the existing routes. In that case, the middleware should just allow the API request to proceed. 

### Non-functional requirements
• NodeJS   
• ES6  
• JEST   
• supertest  
• eslint

### Setup Guide
1. **First** clone this respository with the command: git clone https://github.com/ana-valdemoro/cord-backend-challenge.git
From the command line: 
2. **Second** Install all project dependencies with: `npm i` Node v12^ preferable
3. **Third** try the project with: `npm start`

### Notes
An attempt was made to implement unit tests for `checkAgaintRules` method, but did not suceed. Instead, We managed to implement some unit tests to test `checkIntegerType` function. For trying, add to the `package.json`, `type:module` and execute the command: `npm test`

Moreover, I also decide to include in the project my own manual test suite used during development. You can execute`Cord-challenge.postman_collection_of_tests` using postman.
