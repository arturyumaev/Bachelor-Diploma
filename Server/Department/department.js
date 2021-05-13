const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');

const GenerateQueriesDepartment = require('../Storage/PostgreSQLQuery/GenerateQueriesDepartment');
const storageInterface = require('../connection');

const jsonParser = bodyParser.json();
const departmentQueryGenerator = new GenerateQueriesDepartment();

// Create
router.post('/', jsonParser, async (req, res) => {
  res.set(responseHeaders);
  const newDepartment = req.body;

  const dbres = await storageInterface.create(departmentQueryGenerator.generateCreateDepartment(newDepartment));
  res.json({ status: 'OK', message: 'Department are being created' });
});

// Read
router.get('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const departmentId = Number(req.params['id']);
  const sqlQuery = departmentQueryGenerator.generateGetDepartment(departmentId);
  const result = await storageInterface.select(sqlQuery);
  res.json({ departments: result.rows });
});

// Delete
router.delete('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const departmentId = Number(req.params['id']);
  const sqlQuery = departmentQueryGenerator.generateDeleteDepartment(departmentId);
  const result = await storageInterface.delete(sqlQuery);
  res.json({ departments: result.rows });
});

module.exports = router;
