
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {
      // Inserts seed entries
      return knex('resources').insert([
        { resource_type_id: 1, name: 'Dinky', capacity: 1, min_minutes: 30, max_minutes: 480 },
        { resource_type_id: 2, name: 'Sophia', capacity: 1, min_minutes: 240, max_minutes: 480 },
        { resource_type_id: 2, name: 'Gerald', capacity: 1, min_minutes: 240, max_minutes: 480 },
        { resource_type_id: 1, name: 'Events Room', capacity: 1, min_minutes: 30, max_minutes: 480 },
        { resource_type_id: 3, name: 'Hot Desk', capacity: 10, min_minutes: 240, max_minutes: 480 },
        { resource_type_id: 3, name: 'Test Resource', capacity: 10, min_minutes: 240, max_minutes: 480 }
      ]);
    });
};
