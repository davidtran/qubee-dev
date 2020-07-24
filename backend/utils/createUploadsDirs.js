const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

async function createUploadsDirs(dirs) {
  const result = await Promise.all(dirs.map(item => fs.existsSync(item)));
  const listPathWillBeCreated = [];
  result.map((item, index) => {
    if (!item) {
      listPathWillBeCreated.push(dirs[index]);
    }
  });
  await Promise.all(listPathWillBeCreated.map(item => fs.mkdirAsync(item)));
  return true;
}

module.exports = createUploadsDirs;
