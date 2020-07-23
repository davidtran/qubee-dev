const logger = require('../utils/logger');
const { ValidationError, ApolloError, AuthenticationError } = require("apollo-server-express");
// Validation
const { rawValidateMessage } = require('../utils/validations/common.validation');
const { validateUserRegister } = require('../utils/validations/user.validation');
// Helpers
const { generatePassword } = require("../helpers/hashing.helper");
const { sign } = require('../helpers/jwt.helper');
// Constants
const { STATUS_CONSTANT } = require('../constants/status-code.constant');
const { findUserById, findUserByEmail, createNewUser } = require('../repository/user.repository');
const { findRoleByType } = require('../repository/role.repository');
const { DEFAULT_ROLE } = require('../constants/role.constant');


/**
 * Register user
 * @param {*} userInfo
 * @returns Promise<{ token: String }>
 */
async function registerUser({ name, email, password }) {
  try {
    const validateResult = validateUserRegister({ name, email, password });
    if (validateResult.length > 0) {
      throw new ValidationError(rawValidateMessage(validateResult));
    }
    const userExist = await findUserByEmail(email);
    if (userExist) {
      throw new ApolloError('Email has been registed', STATUS_CONSTANT.CONFLICT_CODE);
    }
    const role = await findRoleByType(DEFAULT_ROLE, ['id']);
    const passwordEncrypted = await generatePassword(password);
    await createNewUser({
      name,
      email,
      password: passwordEncrypted,
      is_archive: false,
      role_id: role && role.id ? role.id : null
    });
    // return token has hashed
    return { token: sign({ email, name }) };
  } catch (error) {
    throw error;
  }
}

/**
 * Get user profile by userId
 * @param {*} userId string
 * @return Promise<User>
 */
async function getUserProfile(userId) {
  try {
    if (!userId) {
      throw new AuthenticationError("Can not find any profile");
    }
    const userProfile = await findUserById(userId, true);
    if (!userProfile || !userProfile.id) {
      throw new AuthenticationError("Can not find any profile");
    }
    userProfile.role = userProfile.role_id;
    return userProfile;
  } catch(error) {
    logger.error(error);
    throw error;
  }
}

module.exports = { registerUser, getUserProfile };
