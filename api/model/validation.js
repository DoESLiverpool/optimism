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

module.exports = { validatedId, validatedDate, checkPostItemFields, checkPutItemFields };
