const settings = require('./settings');
const enableDetailedErrorMessages = settings.enableDetailedErrorMessages;

const utilities = {
  safeErrorMessage: (message) => {
    return enableDetailedErrorMessages ? message : '';
  }
};

module.exports = utilities;
