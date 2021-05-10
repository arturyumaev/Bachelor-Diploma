module.exports = class GenerateQueriesPatient {
  constructor() { }

  generateGetUserInfo(username) {
    let sqlQuery = `
      SELECT * FROM "Patient"
      WHERE username = '${username}';
    `;
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
    return sqlQuery;
  }

  generateGetPatient(patientId) {
    let sqlQuery = `
      SELECT * FROM "Patient"
      ${(patientId !== -1)
        ? `WHERE id = ${patientId}`
        : ''
      }
      ORDER BY id DESC;
    `;
    return sqlQuery;
  }

  generateDeletePatient(patientId) {
    let sqlQuery = `
      DELETE FROM "Patient"
      WHERE id = ${patientId};
    `;
    return sqlQuery;
  }
}
