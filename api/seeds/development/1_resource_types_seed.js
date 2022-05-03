
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('resource_types').del()
    .then(function () {
      // Inserts seed entries
      return knex('resource_types').insert([
        { name: 'room' },
        { name: 'laser-cutter' },
        { name: 'hot-desk' }
      ]);
    });
};
