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
  /* Implementation of CRUD interface */
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

  create = async query => {
    const result = await this.client.query(query);
    return result;
  }

  select = async query => {
    const result = await this.client.query(query);
    return result;
  }

  update = async (query) => {
    const result = await this.client.query(query);
    return result;
  }

  delete = async (query) => {
    const result = await this.client.query(query);
    return result;
  }

  authorize = async (username, password) => {
    const adminData = await this.client.query(generateQueriesAdmin.generateGetUserInfo(username));
    const patientData = await this.client.query(generateQueriesPatient.generateGetUserInfo(username));
    const doctorData = await this.client.query(generateQueriesDoctor.generateGetUserInfo(username));

    return Promise
      .all([adminData, patientData, doctorData])
      .then(results => {
        const data = results.filter(res => res.rowCount);
        return data.length ? data[0].rows[0] : {};
      });
  }
  
  testConnection() {
    this.client
      .query('SELECT NOW()')
      .then(result => console.log(result))
      .catch(e => console.error(e.stack))
      .then(() => this.client.end());
  }
}
