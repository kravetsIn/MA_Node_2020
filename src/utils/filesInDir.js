const fs = require('fs');
const { promisify } = require('util');

async function filesInDir(dirPath) {
  const readdirPromisified = promisify(fs.readdir);
  const statPromisified = promisify(fs.stat);
  const lstatPromisified = promisify(fs.lstat);

  const files = await readdirPromisified(dirPath);
  const listFiles = {
    isEmpty: true,
    list: [],
    message: '',
  };

  if (files.length) {
    const onlyFilesInDir = files.filter(async (file) => {
      const stat = await lstatPromisified(`${dirPath}/${file}`);
      return stat.isFile();
    });

    const filesInfo = onlyFilesInDir.map(async (file) => {
      const { size, birthtime } = await statPromisified(`${dirPath}/${file}`);
      return { filename: file, size, birthtime };
    });

    listFiles.list = await Promise.all(filesInfo);
    listFiles.isEmpty = false;
  } else {
    listFiles.message = `Folder empty`;
  }

  return listFiles;
}

module.exports = filesInDir;
