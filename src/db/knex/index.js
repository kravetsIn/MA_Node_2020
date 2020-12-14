const Knex = require('knex');

const name = 'knex';

const db = (config) => {
  const knex = new Knex(config);

  // const createProductsTable = async () => {
  //   try {
  //     await client.query(
  //       `CREATE TABLE IF NOT EXISTS products(
  //           id SERIAL PRIMARY KEY,
  //           type VARCHAR(255) NOT NULL,
  //           color VARCHAR(255) NOT NULL,
  //           price NUMERIC(10,2) NOT NULL,
  //           quantity BIGINT NOT NULL,
  //           created_at TIMESTAMP DEFAULT NULL,
  //           updated_at TIMESTAMP DEFAULT NULL,
  //           deleted_at TIMESTAMP DEFAULT NULL
  //         )`,
  //     );

  //     return true;
  //   } catch (err) {
  //     console.log(err.message || err);
  //     throw err;
  //   }
  // };

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

  // const getProductByKeys = async (product = {}) => {
  //   try {
  //     if (product.constructor !== Object) throw new Error('ERROR: product not object');
  //     if (Object.keys(product).length === 0) throw new Error('ERROR: product is empty');

  //     const query = [];
  //     const values = [];

  //     // eslint-disable-next-line no-restricted-syntax
  //     for (const [i, [key, value]] of Object.entries(product).entries()) {
  //       query.push(`${key} = $${i + 1}`);
  //       values.push(value);
  //     }

  //     const res = await client.query(
  //       `SELECT * FROM products WHERE ${query.join(' AND ')} AND deleted_at IS NULL`,
  //       values,
  //     );

  //     console.log(`DEBUG: Product updated ${JSON.stringify(res.rows[0])}`);
  //     return res.rows[0];
  //   } catch (err) {
  //     console.error(err.message || err);
  //     throw err;
  //   }
  // };

  // const getAllRowsInTable = async (table) => {
  //   try {
  //     if (!table) throw new Error(`ERROR: No table defined`);

  //     const res = await client.query(`SELECT * FROM ${table} WHERE deleted_at IS NULL`);

  //     return res.rows;
  //   } catch (err) {
  //     console.error(err.message || err);
  //     throw err;
  //   }
  // };

  return {
    testConnection,
    close,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    // getProductByKeys,
    // getAllRowsInTable,
    // createProductsTable,
  };
};

module.exports = db;
