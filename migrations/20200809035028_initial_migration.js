
exports.up = function (knex) {
  return knex.schema
    .createTable('resources', function (t) {
      t.increments('id').primary();
      t.integer('resource_type_id').references('resource_types.id');
      t.string('name', 255).notNullable();
      t.integer('capacity').notNullable();
      t.integer('min_minutes').notNullable();
      t.integer('max_minutes').notNullable();
    })
    .createTable('slots', function (t) {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.integer('day').notNullable();
      t.time('starts').notNullable();
      t.time('ends').notNullable();
    })
    .createTable('resources_slots', function (t) {
      t.integer('resource_id').references('resources.id');
      t.integer('slot_id').references('slots.id');
      t.primary(['resource_id', 'slot_id']);
    })
    .createTable('resource_types', function (t) {
      t.increments('id').primary();
      t.string('name');
    })
    .createTable('bookings', function (t) {
      t.increments('id').primary();
      t.integer('resource_id').references('resources.id');
      t.string('email').notNullable();
      t.string('name').notNullable();
      t.string('notes').notNullable();
      t.datetime('starts').notNullable();
      t.datetime('ends').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('bookings')
    .dropTable('resources_slots')
    .dropTable('resources')
    .dropTable('slots')
    .dropTable('resource_types')
};
