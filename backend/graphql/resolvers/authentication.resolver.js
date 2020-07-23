const { login:loginByEmail } = require('../../services/authentication.service');
module.exports = {
  Mutation: {
    // Handles user login
    async login (_, { email, password }) {
      return await loginByEmail(email, password);
    }
  }
};
