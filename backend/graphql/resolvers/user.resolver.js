const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('./authorization.resolver');

const { getUserProfile, registerUser } = require('../../services/user.service');

module.exports = {
  Query: {
    // fetch the profile of currenly athenticated user
    profile: combineResolvers(
      isAuthenticated,
      async (_, args, { user }) => {
        return await getUserProfile(user.id);
      }
    )
  },

  Mutation: {
    // Handle user signup
    async signup (_, { name, email, password }) {
      return await registerUser({ name, email, password });
    }
  }
}