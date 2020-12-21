module.exports = (client) => {
  try {
    return {
      createType: async ({ name }) => {
        try {
          if (!name) throw new Error(`ERROR: No type name defined`);

          const timestamp = new Date();

          const res = await client.query(
            `INSERT INTO types(name, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4) RETURNING *`,
            [name, timestamp, timestamp, null],
          );

          console.log(`DEBUG: New type created:${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error('createType', err.message || err);
          throw err;
        }
      },

      getType: async (id) => {
        try {
          if (!id) throw new Error(`ERROR: No type id defined`);

          const res = await client.query(
            `SELECT * FROM types WHERE id = $1 AND deleted_at IS NULL`,
            [id],
          );

          return res.rows[0];
        } catch (err) {
          console.error('getType', err.message || err);
          throw err;
        }
      },

      updateType: async ({ id, ...type }) => {
        try {
          if (!id) throw new Error(`ERROR: No type id defined`);

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [key, value]] of Object.entries(type).entries()) {
            query.push(`${key} = $${i + 1}`);
            values.push(value);
          }

          if (!values.length) throw new Error('ERROR: Nothing to update');

          values.push(id);

          const res = await client.query(
            `UPDATE types SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
            values,
          );

          console.log(`DEBUG: type updated ${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error('updateType', err.message || err);
          throw err;
        }
      },

      deleteType: async (id) => {
        try {
          if (!id) throw new Error(`ERROR: No type id defined`);

          await client.query(`UPDATE types SET deleted_at = $1 WHERE id = $2`, [new Date(), id]);

          return true;
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getTypeByKeys: async (type = {}) => {
        try {
          if (type.constructor !== Object) throw new Error('ERROR: type not object');
          if (Object.keys(type).length === 0) throw new Error('ERROR: type is empty');

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [key, value]] of Object.entries(type).entries()) {
            query.push(`${key} = $${i + 1}`);
            values.push(value);
          }

          const res = await client.query(
            `SELECT * FROM types WHERE ${query.join(' AND ')} AND deleted_at IS NULL`,
            values,
          );

          return res.rows[0];
        } catch (err) {
          console.error('getTypeByKeys', err.message || err);
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
