const { createWriteStream, statSync, unlinkSync } = require('fs');
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const rimraf = require("rimraf");
const { join } = require('path');
const ffmpeg = require("fluent-ffmpeg");
const imageThumbnail = require("image-thumbnail");
const { generateUniqueString } = require('../helpers/string.helper');
const { STATUS_CONSTANT } = require('../constants/status-code.constant');
const { createNewFile } = require('../repository/file.repository');
const { ApolloError, ForbiddenError } = require('apollo-server-express');
const FileType = require('file-type');
const options = {
  width: 1920,
  height: 1080,
  jpegOptions: { force: true, quality: 100 },
};
const supportImageExt = ['png', 'jpeg', 'gif', 'bmp', 'jpg'];

async function uploadMultiChunks(fileUpload, folderId, folderPath, totalChunks, chunkNumber, userId, isSecured) {
  let tempDir = null;
  let path = null;
  try {
    const fileId = `${folderId}-${fileUpload.filename}`;
    const { createReadStream, filename } = fileUpload;
    const stream = createReadStream();
    const imageId = generateUniqueString();
    tempDir = join(__dirname, "../public", "uploads/", fileId);
    path = join(__uploadDir, folderPath, filename);
    const fileHasExist = await fs.existsSync(path);

    if (fileHasExist) {
      throw new ApolloError("File is existing", STATUS_CONSTANT.CONFLICT_CODE);
    }

    // create folder
    const folderExist = await fs.existsSync(tempDir);
    if (!folderExist) await fs.mkdirSync(tempDir);

    let thumbnail = null;
    // Store the file in the filesystem.
    await new Promise((resolve, reject) => {
      // Create a stream to which the upload will be written.
      const chunkFilename = join(tempDir, chunkNumber.toString());
      const writeStream = createWriteStream(chunkFilename);

      // When the upload is fully written, resolve the promise.
      writeStream.on('finish', async () => {
        resolve();
      });

      // If there's an error writing the file, remove the partially written file
      // and reject the promise.
      writeStream.on('error', async (error) => {
        await rimraf.sync(tempDir);
        await unlinkSync(path);
        reject(error);
      });

      stream.on('error', (error) => writeStream.destroy(error));
      stream.pipe(writeStream);
    });

    if (chunkNumber === totalChunks) {
      await combineTempFiles(tempDir, path);
      // remove temp dir
      await rimraf.sync(tempDir);
      const fileType = await FileType.fromFile(path);
      let mimetype = null;
      let isImage = false;
      let isVideo = false;
      if (fileType) {
        console.log(fileType);
        mimetype = fileType.mime;
        isImage = mimetype.split('/')[0] === 'image' && supportImageExt.includes(fileType.ext);
        isVideo = mimetype.split('/')[0] === 'video';
        thumbnail = await createFileThumbnail(fileUpload, path, imageId, isImage, isVideo);
      }
      const { size } = statSync(path);
      return createNewFile(folderId, userId, { file_name: `${filename}`, type: mimetype, size, tags: [], is_video: isVideo, is_image: isImage, thumbnail }, isSecured);
    }
  } catch(error) {
    if (tempDir && path) {
      await unlinkSync(path);
      await rimraf.sync(tempDir);
    }

    console.log('general error', error);
    throw error;
  }
}

async function combineTempFiles(tempDir, target) {
  return new Promise(async (resolve, reject) => {
    const files = await fs.readdirSync(tempDir);

    files.sort((file1, file2) => {
      if (parseInt(file1) < parseInt(file2)) {
        return -1;
      } else if (parseInt(file1) > parseInt(file2)) {
        return 1;
      } else {
        return 0;
      }
    });

    let chunkCount = 1;

    const appendChunkToFile = async () => {
      const chunkPath = join(tempDir, (chunkCount).toString());
      const content = await fs.readFileSync(chunkPath);

      await fs.appendFileSync(target, content);

      if (chunkCount <= files.length) {
        appendChunkToFile();
        chunkCount++;
      } else {
        resolve();
      }
    }

    appendChunkToFile();
    chunkCount++;
  });
}

async function createFileThumbnail(fileUpload, uploadedPath, imageId, isImage, isVideo) {
  const { filename } = fileUpload;
  let thumbnail = null;
  if (isImage) {
    thumbnail = await generateThumbnailForImage(uploadedPath, `${filename}-${imageId}_thumbnail-image.jpg`);
  }
  if (isVideo) {
    thumbnail = await generateThumbnailForVideo(uploadedPath, `${filename}-${imageId}_thumbnail-video.jpg`)
  }
  return thumbnail
}

async function generateThumbnailForImage(path, thumbnailName) {
  const thumbnail = await imageThumbnail(path, options);
  await fs.writeFileSync(`${__thumbDir}/${thumbnailName}`, thumbnail);
  return thumbnailName;
}

async function generateThumbnailForVideo(path, thumbnailName) {
  return new Promise((resolve, reject) => {
    ffmpeg(path)
      .on("end", function () {
        resolve(thumbnailName);
      })
      .on("error", function (err) {
        reject(err);
      })
      .screenshots({
        count: 1,
        folder: __thumbDir,
        size: "1920x1080",
        filename: thumbnailName
      });
  });
}

module.exports = {
  uploadMultiChunks
}
