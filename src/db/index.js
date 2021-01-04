const {
  db: { config, defaultType },
} = require('../config');
const { fatal } = require('../utils');

const db = {};
let clientType = defaultType;

const funcWrapper = (func) =>
  typeof func === 'function'
    ? func
    : fatal(`FATAL: Cannot find ${func.name} function for current DB wrapper`);

const init = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const [k, v] of Object.entries(config)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const wrapper = require(`./${k}`)(v);
      // eslint-disable-next-line no-await-in-loop
      await wrapper.testConnection();
      console.log(`INFO: DB wrapper for ${k} initiated`);
      db[k] = wrapper;
    }
  } catch (err) {
    fatal(`FATAL: ${err.message || err}`);
  }
};

const end = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(db)) {
    // eslint-disable-next-line no-await-in-loop
    await v.close();
    console.log(`INFO: DB wrapper for ${k} initiated`);
  }
};

const setType = (t) => {
  if (!t || !db[t]) {
    console.log(`WARNING: Cannot find provided DB type!`);
    return false;
  }
  clientType = t;
  console.log(`INFO: The DB type has been changed to ${t}!`);
  return true;
};

const getType = () => clientType;

const dbWrapper = (t) => db[t] || db[clientType];

module.exports = {
  init,
  end,
  setType,
  getType,
  dbWrapper,
  // --------------

  funcWrapper,
  testConnection: async () => funcWrapper(dbWrapper().testConnection)(),
  close: async () => funcWrapper(dbWrapper().close)(),
  getAllRowsInTable: async (table) => funcWrapper(dbWrapper().getAllRowsInTable)(table),
  createProduct: async (product) => funcWrapper(dbWrapper().createProduct)(product),
  getProduct: async (id) => funcWrapper(dbWrapper().getProduct)(id),
  updateProduct: async (product) => funcWrapper(dbWrapper().updateProduct)(product),
  deleteProduct: async (id) => funcWrapper(dbWrapper().deleteProduct)(id),
  getProductByKeys: async (product) => funcWrapper(dbWrapper().getProductByKeys)(product),
  createColor: async (color) => funcWrapper(dbWrapper().createColor)(color),
  getColor: async (id) => funcWrapper(dbWrapper().getColor)(id),
  updateColor: async (color) => funcWrapper(dbWrapper().updateColor)(color),
  deleteColor: async (id) => funcWrapper(dbWrapper().deleteColor)(id),
  getColorByKeys: async (color) => funcWrapper(dbWrapper().getColorByKeys)(color),
  createType: async (type) => funcWrapper(dbWrapper().createType)(type),
  reedType: async (id) => funcWrapper(dbWrapper().getType)(id),
  updateType: async (type) => funcWrapper(dbWrapper().updateType)(type),
  deleteType: async (id) => funcWrapper(dbWrapper().deleteType)(id),
  getTypeByKeys: async (type) => funcWrapper(dbWrapper().getTypeByKeys)(type),
};
