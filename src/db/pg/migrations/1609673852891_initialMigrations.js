/* eslint-disable camelcase */

exports.shorthands = {
  id: { type: 'INT GENERATED ALWAYS AS IDENTITY' },

  created_at: {
    type: 'timestamp',
    notNull: true,
  },

  updated_at: {
    type: 'timestamp',
    notNull: true,
  },

  deleted_at: {
    type: 'timestamp',
    notNull: false,
    default: null,
  },
};

exports.up = (pgm) => {
  pgm.createTable(
    'types',
    {
      id: 'id',
      name: {
        type: 'VARCHAR(255)',
        notNull: true,
      },
      created_at: 'created_at',
      updated_at: 'updated_at',
      deleted_at: 'deleted_at',
    },
    {
      ifNotExists: true,
      constraints: {
        primaryKey: 'id',
        unique: 'name',
      },
    },
  );

  pgm.createTable(
    'colors',
    {
      id: 'id',
      name: {
        type: 'VARCHAR(255)',
        notNull: true,
        unique: true,
      },
      created_at: 'created_at',
      updated_at: 'updated_at',
      deleted_at: 'deleted_at',
    },
    {
      ifNotExists: true,
      constraints: {
        primaryKey: 'id',
        unique: 'name',
      },
    },
  );

  pgm.createTable(
    'products',
    {
      id: 'id',
      type: {
        type: 'INTEGER',
        notNull: true,
      },
      color: {
        type: 'INTEGER',
        notNull: true,
      },
      price: {
        type: 'NUMERIC(10,2)',
        default: 0.0,
        notNull: true,
      },
      quantity: {
        type: 'BIGINT',
        notNull: true,
        default: 1,
      },
      created_at: 'created_at',
      updated_at: 'updated_at',
      deleted_at: 'deleted_at',
    },
    {
      ifNotExists: true,
      constraints: {
        primaryKey: ['type', 'color', 'price'],
        foreignKeys: [
          {
            columns: 'type',
            references: 'types (id)',
          },
          {
            columns: 'color',
            references: 'colors (id)',
          },
        ],
      },
    },
  );
};

exports.down = (pgm) => {
  pgm.dropTable('products');
  pgm.dropTable('colors');
  pgm.dropTable('types');
};
