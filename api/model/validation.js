const moment = require('moment');

/**
 * Check that an id is a valid number. Used for input validation on routes that require an id.
 *
 * @param {object} id - An object which may be a number, representing a client-supplied id.
 * @returns {boolean} Returns true if the id is a number >= 0, otherwise false.
 */
function checkId (id) {
  const number = Number(id);
  if (Number.isNaN(number) || !Number.isInteger(number) || number < 0) {
    return null;
  }
  return number;
}

/**
 * Check that a client-supplied date is in a format convertible to a valid date.
 *
 * @param {*} date - An object which may be a date, representing a client-supplied date.
 * @returns {boolean} Returns true of the date parameter is a valid date, otherwise false.
 */
function checkDate (date) {
  try {
    const result = moment(date, true);
    return result.isValid() === true ? result : null;
  } catch (error) {
    return null;
  }
}

/**
 * Check that an item's fields are correct for a POST request.
 *
 * @param {object} item - The item to check.
 * @param {object} modelItems - The appropriate class instance - BookingItems, ResourceItems, etc. - to use for checking.
 * @returns {boolean} Returns true if the item has the required fields, false otherwise.
 */
function checkPostItemFields (item, modelItems) {
  // Remove primary key.
  const targetKeys = Object.keys(modelItems.jsonToTableNames).filter(key => key !== modelItems.primaryKeyColumn);
  const itemKeys = Object.keys(item);
  if (targetKeys.length !== itemKeys.length) {
    return false;
  }
  for (const key of itemKeys) {
    if (!targetKeys.includes(key)) {
      return false;
    }
  }
  return true;
}

/**
 * Check that an item's fields are correct for a PUT request.
 *
 * @param {object} item - The item to check.
 * @param {object} modelItems - The appropriate class instance - BookingItems, ResourceItems, etc. - to use for checking.
 * @returns {boolean} Returns true if the item has the required fields, false otherwise.
 */
function checkPutItemFields (item, modelItems) {
  // This includes the primary key.
  const targetKeys = Object.keys(modelItems.jsonToTableNames);
  const itemKeys = Object.keys(item).filter(key => key !== modelItems.primaryKeyColumn);
  for (const key of itemKeys) {
    if (!targetKeys.includes(key)) {
      return false;
    }
  }
  return true;
}

module.exports = { checkId, checkDate, checkPostItemFields, checkPutItemFields };
