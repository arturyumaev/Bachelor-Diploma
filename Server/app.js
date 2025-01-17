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
const procedure = require('./Procedure/procedure');
const department = require('./Department/department');
const appointment = require('./Appointment/appointment');

app.use(cors(corsConfig));
app.use(cookieParser());
app.use('/auth', auth);
app.use('/logout', logout);
app.use('/user', user);
app.use('/location', location);
app.use('/room', room);
app.use('/procedure', procedure);
app.use('/department', department);
app.use('/appointment', appointment);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});
