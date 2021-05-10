module.exports = class GenerateQueriesDoctor {
    constructor() {}
  
    generateGetUserInfo(username) {
      let sqlQuery = `
        SELECT * FROM "Doctor"
        WHERE username = '${username}';
      `;
      return sqlQuery;
    }
  
    generateAuthorize(username) {
      let sqlQuery = `
        SELECT hashsum FROM "Doctor"
        WHERE username = '${username}';
      `;
      return sqlQuery;
    }

    generateNewDoctor(data) {
      let keys = [];
      let values = [];
  
      for (let key in data) {
        keys.push(`"${key}"`);
        values.push(`'${data[key]}'`);
      }
  
      let sqlQuery = `
        INSERT INTO "Doctor"(${keys.join(', ')})
          values (${values.join(', ')});
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

    generateDeleteDoctor(doctorId) {
      let sqlQuery = `
        DELETE FROM "Doctor"
        WHERE id = ${doctorId};
      `;
      return sqlQuery;
    }
  }
  