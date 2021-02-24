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

    this.client.connect();
  }

  authorize = async (username, password) => (
    this.client
      .query(generateQueriesAdmin.generateGetUserInfo(username))
      .then(res => { this.client.end(); return res; })
      .then(res => res.rows[0])
  );
  
  testConnection() {
    this.client
      .query('SELECT NOW()')
      .then(result => console.log(result))
      .catch(e => console.error(e.stack))
      .then(() => this.client.end());
  }
}
