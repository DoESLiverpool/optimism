
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('slots').del()
    .then(function () {
      // Inserts seed entries
      return knex('slots').insert([
        { name: 'Weekday AM', day: 62, starts: '09:30', ends: '13:30' },
        { name: 'Weekday PM', day: 62, starts: '13:30', ends: '17:30' },
        { name: 'Weekday', day: 62, starts: '09:30', ends: '17:30' },
        { name: '9:30 Meeting', day: 62, starts: '09:30', ends: '10:00' },
        { name: '10:00 Meeting', day: 62, starts: '10:00', ends: '10:30' },
        { name: '10:30 Meeting', day: 62, starts: '10:30', ends: '11:00' },
        { name: '11:00 Meeting', day: 62, starts: '11:00', ends: '11:30' },
        { name: '11:30 Meeting', day: 62, starts: '11:30', ends: '12:00' },
        { name: '12:00 Meeting', day: 62, starts: '12:00', ends: '12:30' },
        { name: '12:30 Meeting', day: 62, starts: '12:30', ends: '13:00' },
        { name: '13:00 Meeting', day: 62, starts: '13:00', ends: '13:30' },
        { name: '13:30 Meeting', day: 62, starts: '13:30', ends: '14:00' },
        { name: '14:00 Meeting', day: 62, starts: '14:00', ends: '14:30' },
        { name: '14:30 Meeting', day: 62, starts: '14:30', ends: '15:00' },
        { name: '15:00 Meeting', day: 62, starts: '15:00', ends: '15:30' },
        { name: '15:30 Meeting', day: 62, starts: '15:30', ends: '16:00' },
        { name: '16:00 Meeting', day: 62, starts: '16:00', ends: '16:30' },
        { name: '16:30 Meeting', day: 62, starts: '16:30', ends: '17:00' },
        { name: '17:00 Meeting', day: 62, starts: '17:00', ends: '17:30' }
      ]);
    });
};
