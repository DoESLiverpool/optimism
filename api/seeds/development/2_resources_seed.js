
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('resources')
    .then(function () {
      // Deleted ALL existing entries
      return knex('resources').del()})
    .then(function () {
      // Inserts seed entries
      return knex('resources').insert([
        {id: 1, resource_type_id: 1, name: 'Dinky', capacity: 1, min_minutes: 30, max_minutes: 480},
        {id: 2, resource_type_id: 2, name: 'Sophia', capacity: 1, min_minutes: 240, max_minutes: 480},
        {id: 3, resource_type_id: 2, name: 'Gerald', capacity: 1, min_minutes: 240, max_minutes: 480},
        {id: 4, resource_type_id: 1, name: 'Events Room', capacity: 1, min_minutes: 30, max_minutes: 480},
        {id: 5, resource_type_id: 3, name: 'Hot Desk', capacity: 10, min_minutes: 240, max_minutes: 480},
      ]);
    });
};
