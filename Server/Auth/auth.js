const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const responseHeaders = require('../responseConfig');
const authorizationManager = require('./authorizationManager');

const jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', jsonParser, async (req, res) => {
  res.set(responseHeaders);

  authorizationManager(req)
    .then(authResult => res.json(authResult));
});

module.exports = router;