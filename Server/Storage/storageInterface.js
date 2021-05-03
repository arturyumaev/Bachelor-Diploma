const { request } = require('express');
const { _ } = require('lodash');
const { Client } = require('pg');
const pg = require('pg');
const ConfigurationManager = require('./configurationManager');
const GenerateQueriesAdmin = require('./PostgreSQLQuery/GenerateQueriesAdmin');
const GenerateQueriesPatient = require('./PostgreSQLQuery/GenerateQueriesPatient');
const GenerateQueriesDoctor = require('./PostgreSQLQuery/GenerateQueriesDoctor');
const GenerateQueriesAppointment = require('./PostgreSQLQuery/GenerateQueriesAppointment');
const pool = new pg.Pool();

const generateQueriesAdmin = new GenerateQueriesAdmin();
const generateQueriesPatient = new GenerateQueriesPatient();
const generateQueriesDoctor = new GenerateQueriesDoctor();
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
    this.client.connect();
    const adminData = await this.client.query(generateQueriesAdmin.generateGetUserInfo(username));
    const patientData = await this.client.query(generateQueriesPatient.generateGetUserInfo(username));
    const doctorData = await this.client.query(generateQueriesDoctor.generateGetUserInfo(username));
    this.client.end();

    return Promise
      .all([adminData, patientData, doctorData])
      .then(results => {
        const data = results.filter(res => res.rowCount);
        return data.length ? data[0].rows[0] : {};
      });
  }

  update = async (query) => {
    this.client.connect();
    const result = await this.client.query(query);
    this.client.end();

    return result;
  }
  
  testConnection() {
    this.client
      .query('SELECT NOW()')
      .then(result => console.log(result))
      .catch(e => console.error(e.stack))
      .then(() => this.client.end());
  }
}
