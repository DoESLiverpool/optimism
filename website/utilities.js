const settings = require('./settings');
const enableDetailedErrorMessages = settings.enableDetailedErrorMessages;

utilities = {
    safeErrorMessage: (message) => {
        return enableDetailedErrorMessages ? message : '';
    }
};

module.exports = utilities;