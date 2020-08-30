require('dotenv').config();

const settings = {
    port: process.env.OPTIMISM_WEBSITE_PORT || 3000,
    apiUrl: process.env.OPTIMISM_API_URL || 'http://localhost:3000/api',
    enableDetailedErrorMessages: (process.env.OPTIMISM_ENABLE_DETAILED_ERROR_MESSAGES || 0) === '1'
};

module.exports = settings;

