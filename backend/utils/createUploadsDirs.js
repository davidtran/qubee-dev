const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

async function createUploadsDirs(uploadsDir, sharedDir) {
  // Check if the "Uploads" folder exists in the current directory.
  await fs
    .accessAsync(uploadsDir)
    .catch(async (ex) => {
      // Create the "Uploads" folder in the current directory.
      await fs
        .mkdirAsync(uploadsDir)
        .catch(async (ex) => {
          console.log("Cannot create folder", ex);
          return false;
        });
    });

  // Check if the "Shared" folder exists in the current directory.
  await fs
    .accessAsync(sharedDir)
    .catch(async (ex) => {
      // Create the "Shared" folder in the current directory.
      await fs
        .mkdirAsync(sharedDir)
        .catch((ex) => {
          console.log("Cannot create folder", ex);
          return false;
        });
    });

  return true;
}

module.exports = createUploadsDirs;
