const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: 'rara22',
  port: 5432,
})

client.connect()
client.query('SELECT * from "Location";', (err, res) => {
  console.log(err, res)
  client.end()
})