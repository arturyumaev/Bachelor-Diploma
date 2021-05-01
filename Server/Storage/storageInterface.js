const { request } = require('express');
const { Client } = require('pg');
const ConfigurationManager = require('./configurationManager');
const GenerateQueriesAdmin = require('./PostgreSQLQuery/GenerateQueriesAdmin');
const GenerateQueriesAppointment = require('./PostgreSQLQuery/GenerateQueriesAppointment');

const generateQueriesAdmin = new GenerateQueriesAdmin();
const generateQueriesAppointment = new GenerateQueriesAppointment();

module.exports = class StorageInterface {
  constructor() {
    const configurationManager = new ConfigurationManager();
    this.configuration = configurationManager.importConfiguration();
    console.log('Imported database config:', this.configuration);

    this.client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'testdb',
      password: 'rara22',
      port: 5432,
    })
  }

  select = async query => {
    this.client.connect();
    const result = await this.client.query(query);
    this.client.end();

    return result;
  }

  authorize = async (username, password) => {
    const data = await this.select(generateQueriesAdmin.generateGetUserInfo(username));

    return data.rows[0];
  }
  
  testConnection() {
    this.client
      .query('SELECT NOW()')
      .then(result => console.log(result))
      .catch(e => console.error(e.stack))
      .then(() => this.client.end());
  }
}
