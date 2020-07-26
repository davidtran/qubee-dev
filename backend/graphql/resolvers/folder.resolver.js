const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./authorization.resolver");
const {
  createNewFolder,
  renameFolderItem,
  removeFolderItem
} = require('../../services/folder.service');

module.exports = {
  Query: {
  },
  Mutation: {
    createNewFolder: combineResolvers(
      isAuthenticated,
      async (_, { name, folderId, tags }, { user }) => {
        return await createNewFolder(name, folderId, tags, user.id, user.role.is_secured);
      }
    ),
    renameFolder: combineResolvers(
      isAuthenticated,
      async (_, { folderId, folderName }, { user }) => {
        return await renameFolderItem(folderId, folderName, user);
      }
    ),
    removeFolder: combineResolvers(
      isAuthenticated,
      async (_, { folderIds }, { user }) => {
        return await removeFolderItem(folderIds, user);
      }
    ),
  }
};
