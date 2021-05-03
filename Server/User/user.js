const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');
const GenerateQueriesCommon = require('../Storage/PostgreSQLQuery/GenerateQueriesCommon');
const StorageInterface = require('../Storage/storageInterface');

const jsonParser = bodyParser.json();

const commonQueryGenerator = new GenerateQueriesCommon();

router.put('/', jsonParser, async (req, res) => {
  const storageInterface = new StorageInterface();
  res.set(responseHeaders);
  const data = req.body;
  const query = commonQueryGenerator.updateUserColumns(data.id, data.accessControl, data);
  const result = await storageInterface.update(query);
  // const updatedUser = await storageInterface.select(commonQueryGenerator.generateGetUserInfo(data.id, data.accessControl));
  res.json({ message: 'Updated', status: 'ok' });
});

module.exports = router;