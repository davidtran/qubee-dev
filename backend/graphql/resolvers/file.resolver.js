const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./authorization.resolver");
const {
  handleUploadFile,
  getListFileAndFolder,
  downloadFileAndFolder,
  renameFileItem,
  deleteFileItem,
  handleChangeFileTags,
  handleMoveFile,
  getUploadProgress,
} = require("../../services/file.service");
const { findFolderById } = require("../../repository/folder.repository");
const { ApolloError, ForbiddenError } = require("apollo-server-express");
const { STATUS_CONSTANT } =  require('../../constants/status-code.constant');
const { PERMISSIONS } = require('../../constants/permission.constant');
const { uploadMultiChunks } = require("../../services/fileUpload.service");

module.exports = {
  Query: {
    getFiles: combineResolvers(
      isAuthenticated,
      async (_, { folderId, keyword }, { user }) => {
        const { is_secured } = user.role;
        let folder = {
          id: null,
          path: ''
        };
        if (folderId) {
          folder = await findFolderById(folderId);
          if (!folder) {
            throw new ApolloError('Can not find this folder', STATUS_CONSTANT.NOT_FOUND_CODE);
          }
        }
        return await getListFileAndFolder(folder, keyword, is_secured);
      }
    ),
    getUploadProgress: combineResolvers(
      isAuthenticated,
      async (_, { folderId, filename }, { user }) => {
        let folderPath = '';
        if (folderId) {
          const folder = await findFolderById(folderId);
          if (!folder) {
            throw new ApolloError('Can not find this folder', STATUS_CONSTANT.NOT_FOUND_CODE);
          }
          if (folder.restricted && (user.role.permissions && !user.role.permissions.includes(PERMISSIONS.CAN_CREATE_FILE_IN_ALL_FOLDER) || !user.role)) {
            throw new ForbiddenError("You don't have access to this action");
          }
          folderPath = folder.path;
        }
        return await getUploadProgress(folderId, folderPath, filename);
      }
    )
  },
  Mutation: {
    uploadFile: combineResolvers(
      isAuthenticated,
      async (_, { file: fileHasUpload, folderId, tags, totalChunks, chunkNumber }, { user }) => {
        let folderPath = '';
        if (folderId) {
          const folder = await findFolderById(folderId);
          if (!folder) {
            throw new ApolloError('Can not find this folder', STATUS_CONSTANT.NOT_FOUND_CODE);
          }
          if (folder.restricted && (user.role.permissions && !user.role.permissions.includes(PERMISSIONS.CAN_CREATE_FILE_IN_ALL_FOLDER) || !user.role)) {
            throw new ForbiddenError("You don't have access to this action");
          }
          folderPath = folder.path;
        }
        const file = await fileHasUpload;
        return await uploadMultiChunks(file, folderId || null, folderPath, totalChunks, chunkNumber, user.id, user.role.is_secured);
      }
    ),
    downloadFile: combineResolvers(
      isAuthenticated,
      async (_, { folderId, folders, files }, { user }) => {
        const isHighLevel = user.role.is_secured;
        return await downloadFileAndFolder(folderId, folders, files, isHighLevel);
      }
    ),
    renameFile: combineResolvers(
      isAuthenticated,
      async (_, { fileId, fileName }, { user }) => {
        const isEnoughPermisison = (user.role.is_secured || user.role.permissions.includes(PERMISSIONS.CAN_RENAME_ALL_FILES));
        return await renameFileItem(fileId, fileName, isEnoughPermisison);
      }
    ),
    removeFile: combineResolvers(
      isAuthenticated,
      async (_, { files }, { user }) => {
        const isHighLevel = user.role.is_secured;
        return await deleteFileItem(files, isHighLevel)
      }
    ),
    changeFileTags: combineResolvers(
      isAuthenticated,
      async (_, { fileId, tags }, { user }) => {
        const isEnoughPermisison = (user.role.is_secured || user.role.permissions.includes(PERMISSIONS.CAN_TAGGING_ALL_FILES));
        return await handleChangeFileTags(fileId, tags, isEnoughPermisison);
      }
    ),
    moveFile: combineResolvers(
      isAuthenticated,
      async (_, { folderId, files }, { user }) => {
        const isEnoughPermisison = (user.role.is_secured || user.role.permissions.includes(PERMISSIONS.CAN_MOVE_ALL_FILES));
        return await handleMoveFile(folderId, files, isEnoughPermisison);
      }
    )
  }
};
