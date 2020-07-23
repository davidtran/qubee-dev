const Validator = require('fastest-validator');

const validator = new Validator();

function validateUserRegister(data) {
  const schema = {
    email: { type: "email", max: 255 },
    password: { type: "string", min: 8, max: 50 },
    name: { type: "string", max: 255 }
  };
  
  return validator.validate(data, schema);
}

module.exports = { validateUserRegister };
