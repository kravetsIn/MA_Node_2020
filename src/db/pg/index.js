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
      createDBTables: async () => {
        try {
          await client.query(
            `
          CREATE TABLE IF NOT EXISTS types(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NULL,
            updated_at TIMESTAMP DEFAULT NULL,
            deleted_at TIMESTAMP DEFAULT NULL
          );

          CREATE TABLE IF NOT EXISTS colors(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NULL,
            updated_at TIMESTAMP DEFAULT NULL,
            deleted_at TIMESTAMP DEFAULT NULL
          );

          CREATE TABLE IF NOT EXISTS products(
              id SERIAL PRIMARY KEY,
              type integer,
              color integer,
              price NUMERIC(10,2) NOT NULL,
              quantity BIGINT NOT NULL,
              created_at TIMESTAMP DEFAULT NULL,
              updated_at TIMESTAMP DEFAULT NULL,
              deleted_at TIMESTAMP DEFAULT NULL,
              FOREIGN KEY (type) REFERENCES types (id),
              FOREIGN KEY (color) REFERENCES colors (id)
          );
          `,
          );

          return true;
        } catch (err) {
          console.log(err.message || err);
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
