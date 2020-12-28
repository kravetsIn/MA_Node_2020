const { createGunzip } = require('zlib');
const { promisify } = require('util');
const { pipeline, Writable } = require('stream');

const promisifiedPipeline = promisify(pipeline);

const db = require('../../db');
const { createCsvToJson, buildUniqArrayOfObject } = require('../../utils');

const createProduct = async (product, options = { error: true }) => {
  const { error } = options;

  const productBeingCreated = product;
  const { type, color } = productBeingCreated;

  const hasType = await db.getTypeByKeys({ name: type });
  const hasColor = await db.getColorByKeys({ name: color });

  if (hasType && hasColor) {
    productBeingCreated.type = hasType.id;
    productBeingCreated.color = hasColor.id;

    const createdProduct = await db.createProduct(productBeingCreated);
    return createdProduct;
  }

  const errorMessage = `INFO: Type or color product not created`;

  if (error) {
    const err = new Error(errorMessage);
    err.statusCode = 400;
    throw err;
  } else {
    console.log(errorMessage);
    return false;
  }
};

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

      const createdProduct = await createProduct(product, { error: false });

      if (!createdProduct) console.log(`INFO: Product not added in database`, product);
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

module.exports = {
  createProduct,
  products2db,
};
