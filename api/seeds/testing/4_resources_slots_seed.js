
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('resources_slots').del()
    .then(function () {
      // Inserts seed entries
      return knex('resources_slots').insert([
        { slot_id: 1, resource_id: 2 },
        { slot_id: 2, resource_id: 2 },
        { slot_id: 3, resource_id: 2 },
        { slot_id: 1, resource_id: 3 },
        { slot_id: 2, resource_id: 3 },
        { slot_id: 3, resource_id: 3 },
        { slot_id: 1, resource_id: 5 },
        { slot_id: 2, resource_id: 5 },
        { slot_id: 3, resource_id: 5 },
        { slot_id: 4, resource_id: 1 },
        { slot_id: 5, resource_id: 1 },
        { slot_id: 6, resource_id: 1 },
        { slot_id: 7, resource_id: 1 },
        { slot_id: 8, resource_id: 1 },
        { slot_id: 9, resource_id: 1 },
        { slot_id: 10, resource_id: 1 },
        { slot_id: 11, resource_id: 1 },
        { slot_id: 12, resource_id: 1 },
        { slot_id: 13, resource_id: 1 },
        { slot_id: 14, resource_id: 1 },
        { slot_id: 15, resource_id: 1 },
        { slot_id: 16, resource_id: 1 },
        { slot_id: 17, resource_id: 1 },
        { slot_id: 18, resource_id: 1 },
        { slot_id: 19, resource_id: 1 }
      ]);
    });
};
