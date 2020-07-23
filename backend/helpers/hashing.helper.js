const { compare, genSalt, hash } = require('bcryptjs');

const comparePassword = async (password, hash) => {
  return compare(password, hash);
}

const generatePassword = async (passwordString) => {
  const salt = await genSalt(12);
  return hash(passwordString, salt);
}

module.exports = { comparePassword, generatePassword };
