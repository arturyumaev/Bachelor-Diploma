module.exports = class GenerateQueriesAdmin {
  constructor() {}

  generateGetUserInfo(username) {
    let sqlQuery = `
      SELECT * FROM "Admin"
      WHERE username = '${username}';
    `;
    console.log(sqlQuery);
    return sqlQuery;
  }

  generateAuthorize(username) {
    let sqlQuery = `
      SELECT hashsum FROM "Admin"
      WHERE username = '${username}';
    `;

    return sqlQuery;
  }
}
