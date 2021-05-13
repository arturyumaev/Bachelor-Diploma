const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');

const GenerateQueriesProcedure = require('../Storage/PostgreSQLQuery/GenerateQueriesProcedure');
const storageInterface = require('../connection');

const jsonParser = bodyParser.json();
const procedureQueryGenerator = new GenerateQueriesProcedure();

// Create
router.post('/', jsonParser, async (req, res) => {
  res.set(responseHeaders);
  const newProcedure = req.body;

  const dbres = await storageInterface.create(procedureQueryGenerator.generateCreateProcedure(newProcedure));
  res.json({ status: 'OK', message: 'Procedure are being created' });
});

// Read
router.get('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const procedureId = Number(req.params['id']);
  const sqlQuery = procedureQueryGenerator.generateGetProcedure(procedureId);
  console.log(sqlQuery);
  const result = await storageInterface.select(sqlQuery);
  res.json({ procedures: result.rows });
});

// Delete
router.delete('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const procedureId = Number(req.params['id']);
  const sqlQuery = procedureQueryGenerator.generateDeleteProcedure(procedureId);
  const result = await storageInterface.delete(sqlQuery);
  res.json({ procedures: result.rows });
});

module.exports = router;
