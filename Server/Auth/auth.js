const express = require('express');
const router = express.Router();
const responseHeaders = require('../responseConfig');

router.post('/', (req, res) => {
  res.set(responseHeaders);
  res.json({"route": "auth"});
})

module.exports = router;