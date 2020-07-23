const Folder = require('../database/schemas/folder.schema');

async function findFolderById(folderId) {
  return Folder.findById(folderId);
}

async function getListChildFolder(folderId, keyword = null, isHighLevel = false, listIds = []) {
  const condition = {folder: folderId};
  if (keyword) {
    condition.$text = {$search: keyword};
  }
  if (!isHighLevel) {
    condition.restricted = false;
  }
  if (listIds && listIds.length > 0) {
    condition._id = { "$in": listIds };
  }
  return Folder.find(condition);
}

async function createNewFolderData(data) {
  return Folder.create(data);
}

async function getListFolderByStartWithPath(path) {
  return Folder.find({ path: {$regex: "^"+ path +"//*" }});
}

async function updatePathForListFolder(folders, pathToReplace, newPath) {
  if (!folders || folders.length < 1) {
    return true;
  }
  const foldersToUpdate = folders.map(folder => {
    return {
      updateOne: {
        "filter" : { "_id" : folder.id},
        "update" : { "$set" : { "path" : folder.path.replace(pathToReplace, newPath) } }
      }
    }
  })
  await Folder.bulkWrite(foldersToUpdate);
  return true;
}

async function removeListFolderByIds(folderIds) {
  return Folder.deleteMany({ _id: { '$in': folderIds } });
}

async function getListFolderByIds(folderIds, isSecured = false) {
  const condition = {_id: { '$in': folderIds }};
  if (!isSecured) {
    condition.restricted = false;
  }
  return Folder.find(condition);
}

module.exports = {
  findFolderById,
  getListChildFolder,
  createNewFolderData,
  getListFolderByStartWithPath,
  updatePathForListFolder,
  removeListFolderByIds,
  getListFolderByIds
};
