module.exports = (client) => {
  try {
    return {
      createProduct: async ({ type, color, price = 0, quantity = 1 }) => {
        try {
          if (!type) throw new Error(`ERROR: No product type defined`);
          if (!color) throw new Error(`ERROR: No product color defined`);

          const timestamp = new Date();

          const res = await client.query(
            `INSERT INTO products(type, color, price, quantity, created_at, updated_at, deleted_at)
              VALUES($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (type, color, price) DO UPDATE
                SET quantity = products.quantity + $4
              RETURNING *`,
            [type, color, price, quantity, timestamp, timestamp, null],
          );

          console.log(`DEBUG: New product created:${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error('updateProduct', err.message || err);
          throw err;
        }
      },

      getProduct: async (id) => {
        try {
          if (!id) throw new Error(`ERROR: No product id defined`);

          const res = await client.query(
            `SELECT *
            FROM products
            INNER JOIN types
              ON products.type = types.id
            INNER JOIN colors
              ON products.color = colors.id
            WHERE products.id = $1 AND products.deleted_at IS NULL`,
            [id],
          );

          return res.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      updateProduct: async ({ id, ...product }) => {
        try {
          if (!id) throw new Error(`ERROR: No product id defined`);

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [key, value]] of Object.entries(product).entries()) {
            query.push(`${key} = $${i + 1}`);
            values.push(value);
          }

          if (!values.length) throw new Error('ERROR: Nothing to update');

          values.push(id);

          const res = await client.query(
            `UPDATE products SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
            values,
          );

          console.log(`DEBUG: Product updated ${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error('createProduct', err.message || err);
          throw err;
        }
      },

      deleteProduct: async (id) => {
        try {
          if (!id) throw new Error(`ERROR: No product id defined`);

          // await client.query(`DELETE FROM products WHERE id = $1`, [id]);
          await client.query(`UPDATE products SET deleted_at = $1 WHERE id = $2`, [new Date(), id]);

          return true;
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getProductByKeys: async (product = {}) => {
        try {
          if (product.constructor !== Object) throw new Error('ERROR: product not object');
          if (Object.keys(product).length === 0) throw new Error('ERROR: product is empty');

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [key, value]] of Object.entries(product).entries()) {
            query.push(`${key} = $${i + 1}`);
            values.push(value);
          }

          const res = await client.query(
            `SELECT * FROM products WHERE ${query.join(' AND ')} AND deleted_at IS NULL`,
            values,
          );

          console.log(`DEBUG: Product updated ${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },
    };
    // eslint-disable-next-line no-unreachable
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};
