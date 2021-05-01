const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');

const jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  console.log('logging out user', res.cookie);
  res.cookie('session', '');
  res.json({ payload: "Successfully logged out", status: 'ok' });
});

module.exports = router;