// 'id',
// 'resource_id=resourceId',
// 'email',
// 'notes',
// 'starts',
// 'ends'
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('bookings').del()
    .then(function () {
      // Inserts seed entries
      return knex('bookings').insert([
        { id: 1, resource_id: 1, email: 'someone@example.org', name: 'A Name', notes: 'Some text', starts: '2022-01-01', ends: '2022-01-02' }
      ]);
    });
};
