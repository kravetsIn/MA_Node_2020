const { createGunzip } = require('zlib');
const { promisify } = require('util');
const { pipeline, Writable } = require('stream');

const { createCsvToJson, buildUniqArrayOfObject } = require('../../../utils');
const db = require('../../../db');

const promisifiedPipeline = promisify(pipeline);

const push2db = () => {
  let lastStr = '';

  const uniqProducts = (strArr) => {
    strArr.forEach(async (line) => {
      if (line === '[' || line === ']') return;
      // eslint-disable-next-line no-param-reassign
      if (line[line.length - 1] === ',') line = line.slice(0, -1);

      // eslint-disable-next-line no-param-reassign
      line = line.trim();
      const product = JSON.parse(line);

      let productKey = JSON.parse(JSON.stringify(product));
      productKey.quantity = undefined;
      productKey = JSON.parse(JSON.stringify(productKey));

      const sameProduct = await db.getProductByKeys(productKey);

      if (sameProduct)
        await db.updateProduct({
          id: sameProduct.id,
          quantity: parseInt(product.quantity, 10) + parseInt(sameProduct.quantity, 10),
        });
      else await db.createProduct(product);
    });
  };

  const write = (chunk, encoding, next) => {
    const strArray = chunk.toString().split('\n');

    // Fix line break
    strArray[0] = lastStr + strArray[0];
    lastStr = strArray.pop();

    uniqProducts(strArray);
    next();
  };

  return new Writable({ write });
};

const products2db = async (inputStream) => {
  try {
    const gunzlib = createGunzip();

    const csvToJson = createCsvToJson({ onlyPrice: true });
    const uniqProducts = buildUniqArrayOfObject();
    const sendProducts = push2db();
    inputStream.on('error', (err) => console.log(err));

    await promisifiedPipeline(inputStream, gunzlib, csvToJson, uniqProducts, sendProducts);
  } catch (err) {
    console.error('CSV pipeline failed', err);
    throw err;
  }
};

const csv2db = async (req, res, next) => {
  try {
    await products2db(req);
    res.send({ status: 'ok' });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

module.exports = csv2db;
