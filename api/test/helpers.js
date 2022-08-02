const testData = {
  resources: {
    example: {
      id: 1,
      resourceTypeId: 1,
      name: 'Test',
      capacity: 123,
      minimumBookingTime: 30,
      maximumBookingTime: 60
    }
  },
  slots: {
    example: {
      id: 1,
      name: 'sometime',
      day: 12,
      starts: '02:34',
      ends: '03:45'
    }
  },
  'resource-types': {
    example: {
      id: 1,
      name: 'A resource type'
    }
  },
  bookings: {
    example: {
      id: 1,
      resourceId: 1,
      email: 'someone@example.org',
      name: 'A Name',
      notes: 'Some notes',
      starts: '2022-1-1',
      ends: '2022-1-2'
    }
  }
};

/**
 * Gets id test data for GET methods.
 *
 * @param {string} itemsName - The name of the items endpoint. For example, resources, bookings etc.
 * @returns {Array<object>} An array of test data of valid and other ids.
 */
function getIdTestDataForGet (itemsName) {
  return [
    { description: `valid ${itemsName} id`, id: 1, httpStatusCode: 200 },
    { description: `invalid ${itemsName} id`, id: -1, httpStatusCode: 400 },
    { description: `non-existant ${itemsName} id`, id: 9999, httpStatusCode: 404 }
  ];
}

/**
 * Gets id test data for DELETE methods.
 *
 * @param {string} itemsName - The name of the items endpoint. For example, resources, bookings etc.
 * @returns {Array<object>} An array of test data of valid and other ids.
 */
function getIdTestDataForDelete (itemsName) {
  return [
    { description: `valid ${itemsName} id`, id: 1, httpStatusCode: 200 },
    { description: `invalid ${itemsName} id`, id: -1, httpStatusCode: 400 },
    { description: `non-existant ${itemsName} id`, id: 9999, httpStatusCode: 204 }
  ];
}

/**
 * Get test data for a given item type for POST tests.
 *
 * @param {string} itemsName - The name of the items endpoint. For example, resources, bookings etc.
 * @returns {object} An object with a two keys: example and tests. example is a valid item of the required type.
 *   tests is an array of test objects, with valid and invalid items.
 */
function getPostTestData (itemsName) {
  const results = [];
  const data = testData[itemsName];
  // Valid data for a POST must include all properties except id.
  const valid = { ...data.example };
  delete valid.id;
  results.push({
    description: `valid ${itemsName} item`,
    httpStatusCode: 201,
    body: { ...valid }
  });
  // Remove one of the properties.
  const missing = { ...valid };
  delete missing[Object.keys(missing)[0]];
  results.push({
    description: `missing field in supplied ${itemsName} item`,
    httpStatusCode: 400,
    body: { ...missing }
  });
  // Use the data.example value, which has the id included.
  results.push({
    description: `an id field supplied in the ${itemsName} item`,
    httpStatusCode: 400,
    body: { ...data.example }
  });
  // Add an extra field to the otherwise valid object.
  const extra = { ...valid };
  extra.shouldNot = 'be here';
  results.push({
    description: `an extra field supplied in the ${itemsName} item`,
    httpStatusCode: 400,
    body: { ...extra }
  });
  return { example: { ...valid }, tests: results };
}

/**
 * Get test data for a given item type for PUT tests.
 *
 * @param {*} itemsName - The name of the items endpoint. For example, resources, bookings etc.
 * @returns {Array<object>} An array of test objects to test valid and invalid items.
 */
function getPutTestData (itemsName) {
  const results = [];
  const example = testData[itemsName].example;
  results.push({
    description: `valid ${itemsName} item fields`,
    httpStatusCode: 200,
    id: 1,
    body: { ...example }
  });
  const noId = { ...example };
  delete noId.id;
  results.push({
    description: `no id field in supplied ${itemsName} item`,
    httpStatusCode: 200,
    id: 1,
    body: noId
  });
  const differentId = { ...example };
  differentId.id = 2;
  results.push({
    description: `id in request URL not equal to ${itemsName} item id`,
    httpStatusCode: 400,
    id: 1,
    body: differentId
  });
  results.push({
    description: 'invalid id',
    httpStatusCode: 400,
    id: -1,
    body: { ...example }
  });
  const noSuchId = { ...example };
  noSuchId.id = 9999;
  results.push({
    description: `non-existent id field in supplied ${itemsName} item`,
    httpStatusCode: 404,
    id: 9999,
    body: noSuchId
  });
  return results;
}

module.exports = { getIdTestDataForGet, getPostTestData, getPutTestData, getIdTestDataForDelete };
