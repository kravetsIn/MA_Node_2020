const Knex = require('knex');

const name = 'knex';

const db = (config) => {
  const knex = new Knex(config);

  const testConnection = async () => {
    try {
      console.log(`INFO: Hello from ${name} testConnection`);
      await knex.raw('SELECT NOW()');
    } catch (err) {
      console.log(err.message || err);
      throw err;
    }
  };

  const close = async () => {
    try {
      console.log(`INFO: Closing ${name} DB wrapper`);
      // No close for knex
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
      const timestamp = new Date();

      delete p.id;
      p.price = p.price || 0;
      p.quantity = p.quantity || 1;
      p.created_at = timestamp;
      p.updated_at = timestamp;

      const res = await knex('products').insert(p).returning('*');

      console.log(`DEBUG: New product created:${JSON.stringify(res[0])}`);
      return res[0];
    } catch (err) {
      console.error('updateProduct', err.message || err);
      throw err;
    }
  };

  const getProduct = async (id) => {
    try {
      if (!id) throw new Error(`ERROR: No product id defined`);

      const res = await knex('products').where('id', id).whereNull('deleted_at');

      return res[0];
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  };

  const updateProduct = async ({ id, ...product }) => {
    try {
      if (!id) throw new Error(`ERROR: No product id defined`);

      if (!Object.keys(product).length) throw new Error('ERROR: Nothing to update');

      const res = await knex('products').update(product).where('id', id).returning('*');

      console.log(`DEBUG: Product updated ${JSON.stringify(res[0])}`);
      return res[0];
    } catch (err) {
      console.error('createProduct', err.message || err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      if (!id) throw new Error(`ERROR: No product id defined`);

      // await knex('pridycts').where('id', id).del();
      await knex('products').where('id', id).update('deleted_at', new Date());

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

module.exports = db;
