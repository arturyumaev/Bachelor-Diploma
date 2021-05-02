module.exports = class GenerateQueriesDoctor {
    constructor() {}
  
    generateGetUserInfo(username) {
      let sqlQuery = `
        SELECT * FROM "Doctor"
        WHERE username = '${username}';
      `;
      console.log(sqlQuery);
      return sqlQuery;
    }
  
    generateAuthorize(username) {
      let sqlQuery = `
        SELECT hashsum FROM "Doctor"
        WHERE username = '${username}';
      `;
  
      return sqlQuery;
    }
  }
  