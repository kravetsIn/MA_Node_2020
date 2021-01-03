const { createGunzip } = require('zlib');
const { nanoid } = require('nanoid');
const { promisify } = require('util');
const { pipeline } = require('stream');
const fs = require('fs');

const {
  path: { uploads },
} = require('../../config');
const { createCsvToJson } = require('../../utils');

const promisifiedPipeline = promisify(pipeline);

const uploadCsv = async (inputStream) => {
  try {
    const gunzlib = createGunzip();

    const filename = nanoid(16);

    const filePath = `${uploads}/${filename}.json`;
    const outputStream = fs.createWriteStream(filePath);
    const csvToJson = createCsvToJson({ onlyPrice: false });
    inputStream.on('error', (err) => console.log(err));

    await promisifiedPipeline(inputStream, gunzlib, csvToJson, outputStream);
  } catch (err) {
    console.error('CSV pipeline failed', err);
    throw err;
  }
};

module.exports = uploadCsv;
