const File = require('../database/schemas/file.schema');
const mongose = require('mongoose');

async function getListFileByFolderId(folderId, keyword = null, isHighLevel = false, listIds = []) {
  const condition = { folder: folderId };
  if (keyword) {
    condition.$text = {$search: keyword};
  }
  if (!isHighLevel) {
    condition.restricted = false;
  }
  if (listIds && listIds.length > 0) {
    condition._id = { "$in": listIds };
  }
  return File.find(condition);
}

async function createNewFile(folder, user, data, isRestricted) {
  const dataFile = await File.create({
    folder,
    user,
    ...data,
    restricted: isRestricted
  });
  return await File.findById(dataFile.id).populate('user', ['id', 'email', 'name']);
}

async function getFileById(fileId, isGetFolder = false) {
  if (!isGetFolder) {
    return File.findById(fileId);
  }
  return File.findById(fileId).populate('folder');
}

async function getListFileByIds(ids, isHighLevel = false) {
  const condition = { _id: { "$in": ids } };
  if (!isHighLevel) {
    condition.restricted = false;
  }
  return File.find(condition).populate('folder');
}

async function removeListFile(ids) {
  try {
    await File.deleteMany({ _id: { '$in': ids } });
    return true;
  } catch (error) {
    throw error;
  }
}

async function removeFilesByFolderIds(folderIds) {
  return File.deleteMany({ folder: { '$in': folderIds }});
}

module.exports = {
  getListFileByFolderId,
  createNewFile,
  getFileById,
  getListFileByIds,
  removeListFile,
  removeFilesByFolderIds
};
