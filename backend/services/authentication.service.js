const logger = require("../utils/logger");
const { validateLoginRequest } = require('../utils/validations/auth.validation');
const { ValidationError, AuthenticationError } = require('apollo-server-express');
const { rawValidateMessage } = require("../utils/validations/common.validation");
const { findUserByEmail, finallAll } = require('../repository/user.repository');
const { comparePassword } = require('../helpers/hashing.helper');
const { sign, verify } = require('../helpers/jwt.helper');

async function login(email, password) {
  try {
    const validateResult = validateLoginRequest({ email, password });
    if (validateResult.length > 0) {
      throw new ValidationError(rawValidateMessage(validateResult));
    }
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AuthenticationError("Email or password is incorrect");
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      throw new AuthenticationError("Email or password is incorrect");
    }
    // return token has hashed
    return { token: sign({ email: user.email, name: user.name }) };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

async function getUserLogined(request) {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ');
      if (!token[1] || token[0] !== 'Bearer') {
        return null;
      }
      const { user } = verify(token[1]);
      if (!user || !user.email) {
        return null;
      }
      const userInfo = await findUserByEmail(user.email, true);
      if (!userInfo) {
        return null;
      }
      return { email: userInfo.email, id: userInfo.id, name: userInfo.name, role: userInfo.role_id };
    } catch(error) {
      throw new AuthenticationError("Authentication failure");
    }
  }
}

module.exports = { login, getUserLogined };