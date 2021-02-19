const express = require('express');
const router = express.Router();
const responseHeaders = require('../responseConfig');

router.get('/', (req, res) => {
  res.set(responseHeaders);
  res.json({"route": "auth"});
})

module.exports = router;