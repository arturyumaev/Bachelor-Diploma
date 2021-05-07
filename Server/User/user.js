// Libraries
const express = require('express');
const bodyParser = require('body-parser');
var cyrillicToTranslitJs = require("cyrillic-to-translit-js");
const router = express.Router();
const responseHeaders = require('../responseConfig');

// Storage
const GenerateQueriesCommon = require('../Storage/PostgreSQLQuery/GenerateQueriesCommon');
const GenerateQueriesPatient = require('../Storage/PostgreSQLQuery/GenerateQueriesPatient');
const storageInterface = require('../connection');

// Utils and services
const EmailService = require('../EmailService/EmailService');
const utils = require('../utils');
const { generateNRandomNumbers, generatePassword } = utils;

const jsonParser = bodyParser.json();

const commonQueryGenerator = new GenerateQueriesCommon();
const patientQueryGenerator = new GenerateQueriesPatient();
const cyrillicToTranslit = new cyrillicToTranslitJs();
const emailService = new EmailService();

router.put('/', jsonParser, async (req, res) => {
  res.set(responseHeaders);
  const data = req.body;
  const query = commonQueryGenerator.updateUserColumns(data.id, data.accessControl, data);
  const result = await storageInterface.update(query);
  const updatedUser = await storageInterface.select(commonQueryGenerator.generateGetUserInfo(data.id, data.accessControl));
  res.json(updatedUser.rows[0]);
});

router.post('/patient', jsonParser, async (req, res) => {
  res.set(responseHeaders);
  const data = req.body;
  
  const username = cyrillicToTranslit.transform(
    `${data.firstName} ${data.lastName} `, '-',
  ) + generateNRandomNumbers(2).join('');
  const password = generatePassword();
  
  const newPatient = {
    ...data,
    username,
    hashsum: password,
    accessControl: 'Patient',
  }

  const dbres = await storageInterface.create(patientQueryGenerator.generateNewPatient(newPatient));
  emailService.sendAccessData(newPatient.firstName, username, password)
    .then(
      (response) => res.json({ result: 'OK', status: response.status, text: response.text }),
      (err) => res.json({ result: 'ERROR', error: err })
    );
});

router.get('/patient/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const patientId = Number(req.params['id']);
  const sqlQuery = patientQueryGenerator.generateGetPatient(patientId);
  console.log(sqlQuery);
  const result = await storageInterface.select(sqlQuery);
  res.json({ patients: result.rows });
});

router.delete('/patient/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const patientId = Number(req.params['id']);
  const sqlQuery = patientQueryGenerator.generateDeletePatient(patientId);
  const result = await storageInterface.delete(sqlQuery);
  res.json({ patients: result.rows });
});

module.exports = router;
