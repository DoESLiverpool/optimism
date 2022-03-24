const moment = require('moment');

function validatedId (id) {
  const number = Number(id);
  if (Number.isNaN(number) || !Number.isInteger(number) || number < 0) {
    return null;
  }
  return number;
}

function validatedDate (date) {
  try {
    const result = moment(date, true);
    return result.isValid() === true ? result : null;
  } catch (error) {
    return null;
  }
}

module.exports = { validatedId, validatedDate };
