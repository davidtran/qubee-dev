const { existsSync, mkdirSync, renameSync, rmdirSync } = require('fs');
const { join } = require('path');
const { ApolloError, ForbiddenError } = require('apollo-server-express');
const { generateFolderSlug } = require('../helpers/string.helper');
const { STATUS_CONSTANT } = require('../constants/status-code.constant');
const { PERMISSIONS } = require('../constants/permission.constant');
const {
  findFolderById,
  createNewFolderData,
  getListFolderByStartWithPath,
  updatePathForListFolder,
  removeListFolderByIds,
  getListFolderByIds
} = require('../repository/folder.repository');
const {
  removeFilesByFolderIds
} = require('../repository/file.repository');
const rimraf = require("rimraf");

async function createNewFolder(folderName, folderId, tags, userId, isHighLevel) {
  try {
    let dirPath = '';
    if (folderId) {
      const folder = await findFolderById(folderId);
      if (!folder) {
        throw new ApolloError('Can not find this folder', STATUS_CONSTANT.NOT_FOUND_CODE);
      }
      dirPath = folder.path;
    }
    const folderSlug = generateFolderSlug(folderName);
    if (!folderSlug) {
      throw new ApolloError('Folder slug is empty', STATUS_CONSTANT.NOT_FOUND_CODE);
    }
    if (existsSync(`${__uploadDir}/${dirPath}/${folderSlug}`)) {
      throw new ApolloError("Folder is exist", STATUS_CONSTANT.CONFLICT_CODE);
    }
    const newFolder = await createNewFolderData({ name: folderName, folder: folderId, user: userId, path: `${dirPath}/${folderSlug}`, restricted: isHighLevel, tags });
    mkdirSync(`${__uploadDir}/${dirPath}/${folderSlug}`);
    return newFolder;
  } catch(error) {
    throw error;
  }
}

async function renameFolderItem(folderId, folderName, user) {
  try {
    if (!folderName) {
      throw new ApolloError('Folder name can not be null', STATUS_CONSTANT.NOT_FOUND_CODE);
    }
    const folder = await findFolderById(folderId);
    if (!folder || !folder.name) {
      throw new ApolloError('Can not find any folder to rename', STATUS_CONSTANT.NOT_FOUND_CODE);
    }
    if (folder.restricted && (!user.role || !user.role.permissions || !user.role.permissions.includes(PERMISSIONS.CAN_RENAME_ALL_FOLDERS))) {
      throw new ForbiddenError("You don't have any access to this action");
    }
    const folderPath = folder.path.split('/');
    const folderNewSubPath = generateFolderSlug(folderName);
    const data = await getListFolderByStartWithPath(folder.path);
    await updatePathForListFolder(data.concat([folder]), '/' + folderPath[folderPath.length - 1], '/' + folderNewSubPath);
    folder.name = folderName;
    await folder.save();
    folderPath[folderPath.length - 1] = folderNewSubPath;
    renameSync(
      join(__uploadDir, folder.path),
      join(__uploadDir, folderPath.join('/'))
    );
    return folder;
  } catch (error) {
    throw error;
  }
}

async function removeFolderItem(folderIds, user) {
  try {
    const folders = await getListFolderByIds(folderIds, user.role.is_secured);
    if (!folders || folders.length < 1) {
      throw new ApolloError('Can not find any folder to remove', STATUS_CONSTANT.NOT_FOUND_CODE);
    }
    const data = await Promise.all(folders.map((item) => getListFolderByStartWithPath(item.path)))
    const listFolders = data.flat();
    const listFolderMapping = listFolders.concat(folders);
    const folderIdsToRemove = listFolderMapping.map(item => item.id);
    await removeFilesByFolderIds(folderIdsToRemove);
    await removeListFolderByIds(folderIdsToRemove);
    folders.map((item) => rimraf.sync(join(__uploadDir, item.path)))
    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = { createNewFolder, createNewFolder, renameFolderItem, removeFolderItem };
