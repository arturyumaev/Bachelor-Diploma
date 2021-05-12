const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');

const GenerateQueriesRoom = require('../Storage/PostgreSQLQuery/GenerateQueriesRoom');
const storageInterface = require('../connection');

const jsonParser = bodyParser.json();
const roomQueryGenerator = new GenerateQueriesRoom();

// Create
router.post('/', jsonParser, async (req, res) => {
  res.set(responseHeaders);
  const newRoom = req.body;

  const dbres = await storageInterface.create(roomQueryGenerator.generateCreateRoom(newRoom));
  res.json({ status: 'OK', message: 'Room are being created' });
});

// Read
router.get('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const roomId = Number(req.params['id']);
  const sqlQuery = roomQueryGenerator.generateGetRoom(roomId);
  console.log(sqlQuery);
  const result = await storageInterface.select(sqlQuery);
  res.json({ rooms: result.rows });
});

// Delete
router.delete('/:id', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  const roomId = Number(req.params['id']);
  const sqlQuery = roomQueryGenerator.generateDeleteRoom(roomId);
  const result = await storageInterface.delete(sqlQuery);
  res.json({ rooms: result.rows });
});

module.exports = router;
