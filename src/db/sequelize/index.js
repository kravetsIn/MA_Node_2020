const path = require('path');
const { readdirSync } = require('fs');

const Sequelize = require('sequelize');

const modelsDir = path.join(__dirname, './models');

const name = 'sequelize';

module.exports = (config) => {
  const sequelize = new Sequelize(config);
  const db = {};

  readdirSync(modelsDir)
    .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
    .forEach((file) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) db[modelName].associate(db);
  });

  const testConnection = async () => {
    try {
      console.log(`INFO: Hello from ${name} testConnection`);
      await sequelize.authenticate();
    } catch (err) {
      console.log(err.message || err);
      throw err;
    }
  };

  const close = async () => {
    try {
      console.log(`INFO: Closing ${name} DB wrapper`);
      return sequelize.close();
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  };

  const createProduct = async (product) => {
    try {
      if (!product.type) throw new Error(`ERROR: No product type defined`);
      if (!product.color) throw new Error(`ERROR: No product color defined`);

      const p = JSON.parse(JSON.stringify(product));
      const timestamp = Date.now();

      delete p.id;
      p.price = p.price || 0;
      p.quantity = p.quantity || 1;
      p.created_at = timestamp;
      p.updated_at = timestamp;

      const res = await db.Product.create(p);

      console.log(`DEBUG: New product created:${JSON.stringify(res)}`);
      return res;
    } catch (err) {
      console.error('updateProduct', err.message || err);
      throw err;
    }
  };

  const getProduct = async (id) => {
    try {
      if (!id) throw new Error(`ERROR: No product id defined`);

      const res = await db.Product.findOne({
        where: {
          id,
          deletedAt: { [Sequelize.Op.is]: null },
        },
      });

      return res;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  };

  const updateProduct = async ({ id, ...product }) => {
    try {
      if (!id) throw new Error(`ERROR: No product id defined`);

      if (!Object.keys(product).length) throw new Error('ERROR: Nothing to update');

      const res = await db.Product.update(product, { where: { id }, returning: true });

      console.log(`DEBUG: Product updated ${JSON.stringify(res[1][0])}`);
      return res[1][0];
    } catch (err) {
      console.error('createProduct', err.message || err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      if (!id) throw new Error(`ERROR: No product id defined`);

      // await db.Product.destroy({ where: { id } });
      await db.Product.update({ deletedAt: Date.now() }, { where: id });

      return true;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  };

  return {
    testConnection,
    close,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
  };
};
