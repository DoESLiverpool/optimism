const express = require('express');
const axios = require('axios');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;

const router = express.Router();
module.exports = router;

router.get('/select-a-resource', async function (req, res) {
  try {
    const resources = await axios.get(`${apiUrl}/resources`);
    const resourceTypes = await axios.get(`${apiUrl}/resource-types`);
    for (const r of resources.data) {
      r.resourceTypeName = _getResourceTypeName(resourceTypes.data, r.resourceTypeId);
    }
    res.render('select-a-resource.html', { resources: resources.data });
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

/**
 * Gets the name of a resource type, given its id.
 *
 * @param {*} resourceTypes - An array of all resourceTypes.
 * @param {*} typeId - The resourceType id.
 * @returns {string|null} - Returns the name of the resourceType or null if not found.
 */
function _getResourceTypeName (resourceTypes, typeId) {
  for (const r of resourceTypes) {
    if (r.id === typeId) {
      return r.name;
    }
  }
  return null;
}
