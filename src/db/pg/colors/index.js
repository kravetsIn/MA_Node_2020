module.exports = (client) => {
  try {
    return {
      createColor: async ({ name }) => {
        try {
          if (!name) throw new Error(`ERROR: No color name defined`);

          const timestamp = new Date();

          const res = await client.query(
            `INSERT INTO colors(name, created_at, updated_at, deleted_at)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (name)
              DO NOTHING
            RETURNING *`,
            [name, timestamp, timestamp, null],
          );

          console.log(`DEBUG: New color created:${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error('createColor', err.message || err);
          throw err;
        }
      },

      getColor: async (id) => {
        try {
          if (!id) throw new Error(`ERROR: No color id defined`);

          const res = await client.query(
            `SELECT * FROM colors WHERE id = $1 AND deleted_at IS NULL`,
            [id],
          );

          return res.rows[0];
        } catch (err) {
          console.error('getColor', err.message || err);
          throw err;
        }
      },

      updateColor: async ({ id, ...color }) => {
        try {
          if (!id) throw new Error(`ERROR: No color id defined`);

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [key, value]] of Object.entries(color).entries()) {
            query.push(`${key} = $${i + 1}`);
            values.push(value);
          }

          if (!values.length) throw new Error('ERROR: Nothing to update');

          values.push(id);

          const res = await client.query(
            `UPDATE colors SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
            values,
          );

          console.log(`DEBUG: Color updated ${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error('updateColor', err.message || err);
          throw err;
        }
      },

      deleteColor: async (id) => {
        try {
          if (!id) throw new Error(`ERROR: No color id defined`);

          await client.query(`UPDATE colors SET deleted_at = $1 WHERE id = $2`, [new Date(), id]);

          return true;
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getColorByKeys: async (color = {}) => {
        try {
          if (color.constructor !== Object) throw new Error('ERROR: color not object');
          if (Object.keys(color).length === 0) throw new Error('ERROR: color is empty');

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [key, value]] of Object.entries(color).entries()) {
            query.push(`${key} = $${i + 1}`);
            values.push(value);
          }

          const res = await client.query(
            `SELECT * FROM colors WHERE ${query.join(' AND ')} AND deleted_at IS NULL`,
            values,
          );

          return res.rows[0];
        } catch (err) {
          console.error('getColorByKeys', err.message || err);
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
