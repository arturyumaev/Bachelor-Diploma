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

    generateGetDoctor(doctorId) {
      let sqlQuery = `
        SELECT * FROM "Doctor"
        ${(doctorId !== -1)
          ? `WHERE id = ${doctorId}`
          : ''
        }
        ORDER BY id DESC;
      `;
      return sqlQuery;
    }
  
    generateDeleteDoctor(doctorId) {
      let sqlQuery = `
        DELETE FROM "Doctor"
        WHERE id = ${doctorId};
      `;
  
      return sqlQuery;
    }
  }
  