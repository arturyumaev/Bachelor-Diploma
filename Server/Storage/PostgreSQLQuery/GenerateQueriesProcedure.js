module.exports = class GenerateQueriesProcedure {
  constructor() { }

  generateGetProcedure(procedureId) {
    let sqlQuery = `
      SELECT * FROM "AppointmentProcedure"
      ${(procedureId !== -1)
        ? `WHERE id = ${procedureId}`
        : ''
      }
      ORDER BY id DESC;
    `;
    return sqlQuery;
  }

  generateDeleteProcedure(procedureId) {
    let sqlQuery = `
      DELETE FROM "AppointmentProcedure"
      WHERE id = ${procedureId};
    `;
    return sqlQuery;
  }

  generateCreateProcedure(data) {
    let keys = [];
    let values = [];

    for (let key in data) {
      keys.push(`"${key}"`);
      values.push(`'${data[key]}'`);
    }

    let sqlQuery = `
      INSERT INTO "AppointmentProcedure"(${keys.join(', ')})
        values (${values.join(', ')});
    `;
    return sqlQuery;
  }
}
