require('dotenv').config();

const settings = {
  port: process.env.OPTIMISM_WEBSITE_PORT || 3000,
  apiUrl: process.env.OPTIMISM_API_URL || 'http://localhost:3001/api',
  enableDetailedErrorMessages: (process.env.OPTIMISM_ENABLE_DETAILED_ERROR_MESSAGES || 0) === '1',
  adminUsername: process.env.OPTIMISM_ADMIN_USERNAME,
  adminPassword: process.env.OPTIMISM_ADMIN_PASSWORD
};

module.exports = settings;
