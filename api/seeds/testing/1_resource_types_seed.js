
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('resource_types').del()
    .then(function () {
      // Inserts seed entries
      return knex('resource_types').insert([
        {id: 1, name: 'room'},
        {id: 2, name: 'laser-cutter'},
        {id: 3, name: 'hot-desk'}
      ]);
    });
};
