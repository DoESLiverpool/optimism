const moment = require('moment');

function validatedId (id) {
  const number = Number(id);
  if (Number.isNaN(number) || !Number.isInteger(number) || number < 0) {
    return null;
  }
  return number;
}

function validatedDate (date) {
  return moment(date);
}

module.exports = { validatedId, validatedDate };
