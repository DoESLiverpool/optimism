
exports.up = function (knex) {
  return knex.schema.table('bookings', function (t) {
    t.string('token').unique().nullable();
    t.boolean('cancelled').notNullable().defaultTo(false);
    t.index('token');
    t.index('cancelled');
  });
};

exports.down = function (knex) {
  return knex.schema.table('bookings', function (t) {
    t.dropIndex('cancelled');
    t.dropIndex('token');
    t.dropColumn('cancelled');
    t.dropColumn('token');
  });
};

