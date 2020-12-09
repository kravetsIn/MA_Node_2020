const { promises: fs } = require('fs');

const filesInDir = async (dirPath) => {
  const files = await fs.readdir(dirPath);
  const listFiles = {
    isEmpty: true,
    list: [],
    message: '',
  };

  if (files.length) {
    let onlyFilesInDir = files.map(async (file) => {
      const stat = await fs.lstat(`${dirPath}/${file}`);
      return { isFile: stat.isFile(), file };
    });

    onlyFilesInDir = await Promise.all(onlyFilesInDir);
    onlyFilesInDir = onlyFilesInDir.reduce((acc, obj) => {
      if (obj.isFile) acc.push(obj.file);
      return acc;
    }, []);

    const filesInfo = onlyFilesInDir.map(async (file) => {
      const { size, birthtime } = await fs.stat(`${dirPath}/${file}`);
      return { filename: file, size, birthtime };
    });

    listFiles.list = await Promise.all(filesInfo);
    listFiles.isEmpty = false;
  } else {
    listFiles.message = `Folder empty`;
  }

  return listFiles;
};

module.exports = filesInDir;
