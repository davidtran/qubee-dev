const Validator = require('fastest-validator');

const validator = new Validator();

function validateLoginRequest(data) {
  const schema = {
    email: { type: "email", max: 255 },
    password: { type: "string", min: 8, max: 50 }
  };
  
  return validator.validate(data, schema);
}

module.exports = { validateLoginRequest };
