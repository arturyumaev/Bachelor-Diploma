const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const port = 3000;
const corsConfig = { credentials: true, origin: 'http://localhost:8080' };

/* Routers */
const auth = require('./Auth/auth');
const logout = require('./Auth/logout');
const user = require('./User/user');
const location = require('./Location/location');
const room = require('./Room/room');

app.use(cors(corsConfig));
app.use(cookieParser());
app.use('/auth', auth);
app.use('/logout', logout);
app.use('/user', user);
app.use('/location', location);
app.use('/room', room);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});
