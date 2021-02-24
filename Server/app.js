const express = require('express');
const cors = require('cors');
const app = express()

/* Routers */
const auth = require('./Auth/auth');

const port = 3000;
const corsConfig = { credentials: true, origin: 'http://localhost:8080' };

app.use(cors(corsConfig));
app.use('/auth', auth);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

