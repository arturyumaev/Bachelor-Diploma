module.exports = class GenerateQueriesPatient {
  constructor() { }

  generateGetUserInfo(username) {
    let sqlQuery = `
      SELECT * FROM "Patient"
      WHERE username = '${username}';
    `;
    console.log(sqlQuery);
    return sqlQuery;
  }

  generateAuthorize(username) {
    let sqlQuery = `
      SELECT hashsum FROM "Patient"
      WHERE username = '${username}';
    `;

    return sqlQuery;
  }

  generateNewPatient(data) {
    let keys = [];
    let values = [];
    console.log('new patient', data);

    for (let key in data) {
      keys.push(`"${key}"`);
      values.push(`'${data[key]}'`);
    }

    let sqlQuery = `
      INSERT INTO "Patient"(${keys.join(', ')})
        values (${values.join(', ')});
    `;

    console.log(sqlQuery);
    return sqlQuery;
  }

  generateGetPatient(patientId) {
    let sqlQuery = `
      SELECT * FROM "Patient"
      ${(patientId !== -1)
        ? `WHERE id = ${patientId}`
        : ''
      }
      ;
    `;
    return sqlQuery;
  }

  generateDeletePatient(patientId) {
    let sqlQuery = ``;

    return sqlQuery;
  }
}
