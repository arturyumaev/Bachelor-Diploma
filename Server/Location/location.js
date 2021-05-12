const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');

const GenerateQueriesLocation = require('../Storage/PostgreSQLQuery/GenerateQueriesLocation');
const storageInterface = require('../connection');

const jsonParser = bodyParser.json();
const locationQueryGenerator = new GenerateQueriesLocation();

router.get('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const locationId = Number(req.params['id']);
  const sqlQuery = locationQueryGenerator.generateGetLocation(locationId);
  console.log(sqlQuery);
  const result = await storageInterface.select(sqlQuery);
  res.json({ locations: result.rows });
});

router.delete('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const locationId = Number(req.params['id']);
  const sqlQuery = locationQueryGenerator.generateDeleteLocation(locationId);
  const result = await storageInterface.delete(sqlQuery);
  res.json({ locations: result.rows });
});

module.exports = router;
