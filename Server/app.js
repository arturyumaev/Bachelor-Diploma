const express = require('express')
var cors = require('cors')

const app = express()
const port = 3000
const corsConfig = {
  credentials: true,
  origin: 'http://localhost:8080'
}
const responseHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
}

app.use(cors(corsConfig))

app.get('/', (req, res) => {
  console.log('New request:', req.method, req.headers, req.originalUrl);
  res.set(responseHeaders)
  res.json({"foo": "bar"});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

