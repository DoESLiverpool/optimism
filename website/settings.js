const fs = require('fs');

require('dotenv').config();

const admin_user_path = "/run/secrets/admin_user";
const admin_pass_path = "/run/secrets/admin_pass";
if (fs.existsSync(admin_user_path))
{
  process.env.OPTIMISM_ADMIN_USERNAME = fs.readFileSync(admin_user_path, { encoding: 'utf8' }).trim();
}
if (fs.existsSync(admin_pass_path))
{
  process.env.OPTIMISM_ADMIN_PASSWORD = fs.readFileSync(admin_pass_path, { encoding: 'utf8' }).trim();
}
const settings = {
  port: process.env.OPTIMISM_WEBSITE_PORT || 3000,
  apiUrl: process.env.OPTIMISM_API_URL || 'http://optimism_api:3001/api',
  apiUrlClientSide: process.env.OPTIMISM_API_CLIENT_SIDE_URL || 'http://localhost:3001/api',
  websiteBaseUrl: process.env.OPTIMISM_WEBSITE_BASE_URL || 'http://localhost:3000',
  enableDetailedErrorMessages: (process.env.OPTIMISM_ENABLE_DETAILED_ERROR_MESSAGES || 0) === '1',
  adminUsername: process.env.OPTIMISM_ADMIN_USERNAME,
  adminPassword: process.env.OPTIMISM_ADMIN_PASSWORD
};

module.exports = settings;
