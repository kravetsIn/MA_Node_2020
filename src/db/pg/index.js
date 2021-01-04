const { Pool } = require('pg');

const products = require('./products');
const types = require('./types');
const colors = require('./colors');

const name = 'pg';

const db = (config) => {
  try {
    const client = new Pool(config);
    const tables = ['products', 'types', 'colors'];

    return {
      ...products(client),
      ...types(client),
      ...colors(client),
      testConnection: async () => {
        try {
          console.log(`INFO: Hello from ${name} testConnection`);
          await client.query('SELECT NOW()');
        } catch (err) {
          console.log(err.message || err);
          throw err;
        }
      },
      close: async () => {
        try {
          console.log(`INFO: Closing ${name} DB wrapper`);
          client.end();
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },
      getAllRowsInTable: async (table) => {
        try {
          if (!table) throw new Error(`ERROR: No table defined`);

          if (tables.includes(table)) {
            const res = await client.query(`SELECT * FROM ${table} WHERE deleted_at IS NULL`);
            return res.rows;
          }

          return new Error(`ERROR: Table ${table} not defined`);
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },
    };
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};

module.exports = db;
