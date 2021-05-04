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

// Utils
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
  res.json({ status: dbres.rowCount === 1 ? 'OK' : 'ERROR' });
});

module.exports = router;
