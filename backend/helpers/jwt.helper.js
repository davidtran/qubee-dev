const jwt = require('jsonwebtoken');
const signOptions = {
 issuer:  'JSLancer',
 expiresIn:  "12h",
 algorithm: "HS256"
};

const sign = (payload) => {
  return jwt.sign({ user: payload }, process.env.SECRET, signOptions);
}

const verify = (token) => {
  return jwt.verify(token, process.env.SECRET, signOptions);
}

module.exports = { sign, verify };
