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
    .then(authResult => {
      console.log('authResult', authResult);
      authResult.accessControl && res.cookie('session', `${authResult.accessControl}-abc`, { maxAge: 1000 * 60 * 15 * 4 });
      res.json(authResult);
    });
});

module.exports = router;