const { createWriteStream, unlink, statSync, renameSync } = require('fs');
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { join } = require('path');
const { MEDIA_DIR } = require('../constants/file.constant');
const { generateUniqueString } = require('../helpers/string.helper');
const {
  getListFileByFolderId,
  createNewFile,
  getFileById,
  getListFileByIds,
  removeListFile,
  moveFilesIntoFolderId
} = require('../repository/file.repository');
const { getListChildFolder, findFolderById } = require('../repository/folder.repository');
const { STATUS_CONSTANT } = require('../constants/status-code.constant');
const { raiseException } = require('../utils/response');
const logger = require('../utils/logger');
const { ApolloError, ForbiddenError } = require('apollo-server-express');

async function uploadFileToSystem(fileUpload, folderId, folderPath, tags, userId, isSecured) {
  try {
    const { createReadStream, filename, mimetype } = fileUpload;
    const stream = createReadStream();
    const imageId = generateUniqueString();
    const path = `${__uploadDir}/${folderPath}/${imageId}-${filename}`;
    // Store the file in the filesystem.
    await new Promise((resolve, reject) => {
      // Create a stream to which the upload will be written.
      const writeStream = createWriteStream(path);

      // When the upload is fully written, resolve the promise.
      writeStream.on('finish', resolve);

      // If there's an error writing the file, remove the partially written file
      // and reject the promise.
      writeStream.on('error', (error) => {
        unlink(path, () => {
          reject(error);
        });
      });
      stream.on('error', (error) => writeStream.destroy(error));
      stream.pipe(writeStream);
    });
    const { size } = statSync(path);
    return createNewFile(folderId, userId, { file_name: `${imageId}-${filename}`, type: mimetype, size, tags }, isSecured);
  } catch(error) {
    throw error;
  }
}

async function handleUploadFile(file, folderId, folderPath, tags, userId, isSecured) {
  try {
    return uploadFileToSystem(file, folderId, folderPath, tags, userId, isSecured);
  } catch(error) {
    throw error;
  }
}

async function getListFileAndFolder(folder, keyword, isRestricted) {
  try {
    const [files, folders] = await Promise.all([
      getListFileByFolderId(folder.id, keyword, isRestricted),
      getListChildFolder(folder.id, keyword, isRestricted)
    ]);
    return {
      files,
      folders,
      path: `${MEDIA_DIR}/${folder.path}`
    }
  } catch (error) {
    throw error;
  }
}

async function downloadFile(req, res) {
  try {
    const { body: { folderId, files, folderName }, user: { role: { is_secured: isHighLevel } } } = req;
    let folder = null;
    if (folderId) {
      folder = await findFolderById(folderId);
      if (!isHighLevel && folder.restricted) {
        return raiseException(res, 403, "You don't have permission to this action");
      }
    }
    const data = await getListFileByFolderId(folderId, null, isHighLevel, files);
    if (!data || data.length < 1) {
      return raiseException(res, 404, "No content to download");
    }
    if (data.length > 1) {
      const zipFiles = data
        .filter(file => !!file)
        .map(file => ({
          path: join(__uploadDir, folder ? folder.path : '', file.file_name),
          name: file.file_name,
        }));
      await res.zip({
        files: zipFiles,
        filename: (folderName || (folder && folder.name) || 'File') + '.zip'
      });
    } else {
      const file = data[0];
      const filename = join(__uploadDir, folder ? folder.path : '', file.file_name);    
      return res.download(filename);
    }
  } catch(error) {
    logger.error(error)
    return raiseException(res, 500, "Can not download file", error);
  }
}

async function renameFileItem(fileId, newFileName, isEnoughPermission) {
  try {
    const file = await getFileById(fileId, false);
    if (!file) {
      throw new ApolloError('Can not find this file', STATUS_CONSTANT.NOT_FOUND_CODE);
    }
    if (file.restricted && !isEnoughPermission) {
      throw new ForbiddenError("You don't have access to this action");
    }
    const oldPath = file.file_name;
    const listPath = file.file_name.split('.');
    const folderPath = file.folder && file.folder.path ? file.folder.path : '';
    file.file_name = `${ newFileName }.${ listPath[listPath.length - 1] }`;
    await file.save();
    renameSync(join(__uploadDir, folderPath, oldPath), join(__uploadDir, folderPath, file.file_name));
    return file;
  } catch(error) {
    throw error;
  }
}

async function deleteFileItem(files, isHighLevel) {
  try {
    if (!files || files.length === 0) {
      throw new ApolloError("Can not find any file to remove");
    }
    const listFiles = await getListFileByIds(files, isHighLevel);
    if (!listFiles || listFiles.length < 1) {
      throw new ApolloError("Can not find any file to remove");
    }
    const listFilesWillBeRemoved = listFiles.map((item) => item.id);
    await removeListFile(listFilesWillBeRemoved);
    listFiles.map(file => {
      unlink(join(__uploadDir, file.folder && file.folder.path ? file.folder.path : '', file.file_name), () => {});
    });
    return true;
  } catch (error) {
    throw error;
  }
}

async function handleChangeFileTags(fileId, tags, isEnoughPermission) {
  try {
    if (!fileId) {
      throw new ApolloError('Can not find any file', STATUS_CONSTANT.NOT_FOUND_CODE);
    }
    const file = await getFileById(fileId);
    if (!file) {
      throw new ApolloError('Can not find any file', STATUS_CONSTANT.NOT_FOUND_CODE); 
    }
    if (file.restricted && !isEnoughPermission) {
      throw new ForbiddenError("You don't have access to this action");
    }
    file.tags = tags;
    await file.save();
    return file;
  } catch (error) {
    throw error;
  }
}

async function handleMoveFile(folderId, files, isEnoughPermission) {
  try {
    let folder = {id: null, path: ''};
    if (folderId) {
      folder = await findFolderById(folderId);
      if (!folder) {
        throw new ApolloError('Can not find any folder', STATUS_CONSTANT.NOT_FOUND_CODE);
      }
    }
    const listFiles = await getListFileByIds(files, isEnoughPermission);
    if (!listFiles || listFiles.length < 1) {
      throw new ApolloError("Can not find any file to remove");
    }
    const fileIdsToRemove = [];
    const listFileToRename = [];
    for (let i = 0; i < listFiles.length; i++) {
      fileIdsToRemove.push(listFiles[i].id);
      listFileToRename.push([
        join(__uploadDir, listFiles[i].folder ? listFiles[i].folder.path : '', listFiles[i].file_name),
        join(__uploadDir, folder.path, listFiles[i].file_name),
      ]);
    }
    await moveFilesIntoFolderId(folder.id, fileIdsToRemove);
    await Promise.all(listFileToRename.map((item) => fs.renameSync(item[0], item[1])));
    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  handleUploadFile,
  getListFileAndFolder,
  downloadFile,
  renameFileItem,
  deleteFileItem,
  handleChangeFileTags,
  handleMoveFile
};
