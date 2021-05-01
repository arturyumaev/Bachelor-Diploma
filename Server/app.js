const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express();

/* Routers */
const auth = require('./Auth/auth');
const logout = require('./Auth/logout');

const port = 3000;
const corsConfig = { credentials: true, origin: 'http://localhost:8080' };

app.use(cors(corsConfig));
app.use(cookieParser());
app.use('/auth', auth);
app.use('/logout', logout);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});

