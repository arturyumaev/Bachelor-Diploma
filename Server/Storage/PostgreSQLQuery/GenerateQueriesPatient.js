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
}
