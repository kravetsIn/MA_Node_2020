exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('type').notNullable();
    table.string('color').notNullable();
    table.decimal('price').notNullable().defaultTo(0.0);
    table.decimal('quantity').notNullable().defaultTo(1);
    table.timestamps();
    table.timestamp('deleted_at').nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('products');
  await knex.raw('drop extension if exists "uuid-ossp"');
};
