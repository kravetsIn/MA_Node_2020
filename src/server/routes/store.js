const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const { pipeline } = require('stream');

const {
  path: { uploads, optimize },
} = require('../../config');
const {
  store: { uploadCsv },
} = require('../../services');
const { filesInDir, buildUniqArrayOfObject } = require('../../utils');

const promisifiedPipeline = promisify(pipeline);
const promisifiedFsAccess = promisify(fs.access);

const store = express.Router();

store.get('/list', async (req, res, next) => {
  try {
    const listUploadedFiles = await filesInDir(uploads);
    const listOptimizedFiles = await filesInDir(optimize);

    res.json({ listUploadedFiles, listOptimizedFiles });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

store.post('/optimize', async (req, res, next) => {
  try {
    const { filename } = req.body;
    const filepath = `${uploads}/${filename}`;

    promisifiedFsAccess(filepath, fs.constants.R_OK)
      .then(async () => {
        const readStream = fs.createReadStream(filepath);
        const writeStream = fs.createWriteStream(`${optimize}/${filename}`);

        const buildUniq = buildUniqArrayOfObject();

        res.status(202).json({ message: 'Optimization started' });
        await promisifiedPipeline(readStream, buildUniq, writeStream);
      })
      .catch((err) => {
        err.statusCode = 400;
        throw err;
      });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

store.put('/csv', async (req, res, next) => {
  try {
    await uploadCsv(req);
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }

  res.json({ status: 'ok' });
});

module.exports = store;
