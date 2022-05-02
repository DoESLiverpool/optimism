const express = require('express');
const axios = require('axios');
const router = express.Router();
const settings = require('../../settings');
const utilities = require('../../utilities');

const apiUrl = settings.apiUrl;
module.exports = router;

router.get('/resources', async function (req, res) {
  try {
    const resources = await axios.get(`${apiUrl}/resources`);
    for (const r of resources.data) {
      if (r.resourceTypeId !== null) {
        const resourceType = await axios.get(`${apiUrl}/resource-types/${r.resourceTypeId}`);
        r.resourceTypeName = resourceType.data.name;
      } else {
        r.resourceTypeName = 'None';
      }
      const slots = await axios.get(`${apiUrl}/resources/${r.id}/slots`);
      r.slots = slots.data;
    }
    res.render('admin/resources/view.html', {
      pageName: 'Resources',
      breadCrumbs: {},
      resources: resources.data
    });
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

router.get('/resources/create', async function (req, res) {
  const resourceTypes = await axios.get(`${apiUrl}/resource-types`);
  res.render('admin/resources/create.html', {
    pageName: 'Create',
    breadCrumbs: [
      { name: 'Resources', link: '/admin/resources' }
    ],
    resourceTypes: resourceTypes.data
  });
});

router.post('/resources/create', async function (req, res) {
  const name = req.body.name;
  const resourceTypeId = req.body.resourceTypeId === 'null' ? null : parseInt(req.body.resourceTypeId);
  const capacity = parseInt(req.body.capacity);
  const minimumBookingTime = parseInt(req.body.minimumBookingTime);
  const maximumBookingTime = parseInt(req.body.maximumBookingTime);

  try {
    await axios.post(`${apiUrl}/resources`, {
      name: name,
      capacity: capacity,
      resourceTypeId: resourceTypeId,
      minimumBookingTime: minimumBookingTime,
      maximumBookingTime: maximumBookingTime
    });
    res.redirect('/admin/resources');
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

router.get('/resources/edit/:id', async function (req, res) {
  const id = req.params.id;
  const resource = await axios.get(`${apiUrl}/resources/${id}`);
  if (resource.data.resourceTypeId !== null) {
    const resourceType = await axios.get(`${apiUrl}/resource-types/${resource.data.resourceTypeId}`);
    resource.data.resourceTypeName = resourceType.data.name;
  } else {
    resource.data.resourceTypeName = 'None';
  }
  const resourceTypes = await axios.get(`${apiUrl}/resource-types`);
  return res.render('admin/resources/edit.html', {
    pageName: 'Edit',
    breadCrumbs: [
      { name: 'Resources', link: '/admin/resources' }
    ],
    resource: resource.data,
    resourceTypes: resourceTypes.data
  });
});

router.post('/resources/edit/:id', async function (req, res) {
  try {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    const resourceTypeId = req.body.resourceTypeId === 'null' ? null : parseInt(req.body.resourceTypeId);
    const capacity = parseInt(req.body.capacity);
    const minimumBookingTime = parseInt(req.body.minimumBookingTime);
    const maximumBookingTime = parseInt(req.body.maximumBookingTime);
    await axios.put(`${apiUrl}/resources/${id}`, {
      id: id,
      name: name,
      capacity: capacity,
      resourceTypeId: resourceTypeId,
      minimumBookingTime: minimumBookingTime,
      maximumBookingTime: maximumBookingTime
    });
    const resource = await axios.get(`${apiUrl}/resources/${id}`);
    if (resource.data.resourceTypeId !== null) {
      const resourceType = await axios.get(`${apiUrl}/resource-types/${resource.data.resourceTypeId}`);
      resource.data.resourceTypeName = resourceType.data.name;
    } else {
      resource.data.resourceTypeName = 'None';
    }
    const resourceTypes = await axios.get(`${apiUrl}/resource-types`);
    return res.render('admin/resources/edit.html', {
      pageName: 'Edit',
      breadCrumbs: [
        { name: 'Resources', link: '/admin/resources' }
      ],
      resource: resource.data,
      resourceTypes: resourceTypes.data
    });
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

router.post('/resources/confirm-deletion', async (req, res) => {
  const resourceId = req.body.resourceId;
  const confirmed = req.body.confirmed === 'yes';
  if (confirmed) {
    await axios.delete(`${apiUrl}/resources/${resourceId}`);
    return res.redirect('/admin/resources');
  }
  res.render('admin/resources/confirm-deletion.html', {
    pageName: 'Confirm deletion',
    breadCrumbs: [
      { name: 'Resources', link: '/admin/resources' }
    ],
    resourceId: resourceId
  });
});
