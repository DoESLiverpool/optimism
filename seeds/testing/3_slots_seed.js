
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('slots').del()
    .then(function () {
      // Inserts seed entries
      return knex('slots').insert([
        {id: 1, name: 'Weekday AM', day: 31, starts: '09:30', ends: '13:30'},
        {id: 2, name: 'Weekday PM', day: 31, starts: '13:30', ends: '17:30'},
        {id: 3, name: 'Weekday', day: 31, starts: '09:30', ends: '17:30'},
        {id: 4, name:  '9:30 Meeting', day: 31, starts: '09:30', ends: '10:00'},
        {id: 5, name: '10:00 Meeting', day: 31, starts: '10:00', ends: '10:30'},
        {id: 6, name: '10:30 Meeting', day: 31, starts: '10:30', ends: '11:00'},
        {id: 7, name: '11:00 Meeting', day: 31, starts: '11:00', ends: '11:30'},
        {id: 8, name: '11:30 Meeting', day: 31, starts: '11:30', ends: '12:00'},
        {id: 9, name: '12:00 Meeting', day: 31, starts: '12:00', ends: '12:30'},
        {id: 10, name: '12:30 Meeting', day: 31, starts: '12:30', ends: '13:00'},
        {id: 11, name: '13:00 Meeting', day: 31, starts: '13:00', ends: '13:30'},
        {id: 12, name: '13:30 Meeting', day: 31, starts: '13:30', ends: '14:00'},
        {id: 13, name: '14:00 Meeting', day: 31, starts: '14:00', ends: '14:30'},
        {id: 14, name: '14:30 Meeting', day: 31, starts: '14:30', ends: '15:00'},
        {id: 15, name: '15:00 Meeting', day: 31, starts: '15:00', ends: '15:30'},
        {id: 16, name: '15:30 Meeting', day: 31, starts: '15:30', ends: '16:00'},
        {id: 17, name: '16:00 Meeting', day: 31, starts: '16:00', ends: '16:30'},
        {id: 18, name: '16:30 Meeting', day: 31, starts: '16:30', ends: '17:00'},
        {id: 19, name: '17:00 Meeting', day: 31, starts: '17:00', ends: '17:30'}
      ]);
    });
};
