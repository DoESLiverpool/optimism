const express = require('express');
const axios = require('axios');
const router = express.Router();
const settings = require('../../settings');
const utilities = require('../../utilities');

const apiUrl = settings.apiUrl;
module.exports = router;

router.get('/resource-types', async function (req, res) {
  try {
    const resourceTypes = await axios.get(`${apiUrl}/resource-types`);
    res.render('admin/resource-types/view.html', {
      pageName: 'Resource types',
      breadCrumbs: {},
      resourceTypes: resourceTypes.data
    });
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

router.get('/resource-types/create', async function (req, res) {
  res.render('admin/resource-types/create.html', {
    pageName: 'Create',
    breadCrumbs: [
      { name: 'Resource types', link: '/admin/resource-types' }
    ]
  });
});

router.post('/resource-types/create', async function (req, res) {
  const name = req.body.name;
  try {
    await axios.post(`${apiUrl}/resource-types`, {
      name: name
    });
    res.redirect('/admin/resource-types');
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

router.get('/resource-types/edit/:id', async function (req, res) {
  const id = req.params.id;
  const resourceType = await axios.get(`${apiUrl}/resource-types/${id}`);
  return res.render('admin/resource-types/edit.html', {
    pageName: 'Edit',
    breadCrumbs: [
      { name: 'Resource types', link: '/admin/resource-types' }
    ],
    resourceType: resourceType.data
  });
});

router.post('/resource-types/edit/:id', async function (req, res) {
  try {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    await axios.put(`${apiUrl}/resource-types/${id}`, {
      id: id,
      name: name
    });
    const resourceType = await axios.get(`${apiUrl}/resource-types/${id}`);
    return res.render('admin/resource-types/edit.html', {
      pageName: 'Edit',
      breadCrumbs: [
        { name: 'Resource types', link: '/admin/resource-types' }
      ],
      resourceType: resourceType.data
    });
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

router.post('/resource-types/confirm-deletion', async (req, res) => {
  const resourceTypeId = req.body.resourceTypeId;
  const confirmed = req.body.confirmed === 'yes';
  if (confirmed) {
    await axios.delete(`${apiUrl}/resource-types/${resourceTypeId}`);
    return res.redirect('/admin/resource-types');
  }
  res.render('admin/resource-types/confirm-deletion.html', {
    pageName: 'Confirm deletion',
    breadCrumbs: [
      { name: 'Resource types', link: '/admin/resource-types' }
    ],
    resourceTypeId: resourceTypeId
  });
});
