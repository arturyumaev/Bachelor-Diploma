const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');

const GenerateQueriesAppointment = require('../Storage/PostgreSQLQuery/GenerateQueriesAppointment');
const storageInterface = require('../connection');

const jsonParser = bodyParser.json();
const appointmentQueryGenerator = new GenerateQueriesAppointment();

// Create
router.post('/', jsonParser, async (req, res) => {
  res.set(responseHeaders);
  const newAppointment = req.body;

  const dbres = await storageInterface.create(appointmentQueryGenerator.generateCreateAppointment(newAppointment));
  res.json({ status: 'OK', message: 'Appointment are being created' });
});

// Read
router.get('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const appointmentId = Number(req.params['id']);
  const sqlQuery = appointmentQueryGenerator.generateGetAppointment(appointmentId);
  console.log(sqlQuery);
  const result = await storageInterface.select(sqlQuery);
  res.json({ appointments: result.rows });
});

router.get('/doctor/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const doctorId = Number(req.params['id']);
  const sqlQuery = appointmentQueryGenerator.generateGetDoctorAppointment(doctorId);
  console.log(sqlQuery);
  const result = await storageInterface.select(sqlQuery);
  res.json({ appointments: result.rows });
});

// Delete
router.delete('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const appointmentId = Number(req.params['id']);
  const sqlQuery = appointmentQueryGenerator.generateDeleteAppointment(appointmentId);
  const result = await storageInterface.delete(sqlQuery);
  res.json({ appointments: result.rows });
});

module.exports = router;
