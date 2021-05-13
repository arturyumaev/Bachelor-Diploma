module.exports = class GenerateQueriesDepartment {
  constructor() { }

  generateGetDepartment(departmentId) {
    let sqlQuery = `
      SELECT * FROM "Department"
      ${(departmentId !== -1)
        ? `WHERE id = ${departmentId}`
        : ''
      }
      ORDER BY id DESC;
    `;
    return sqlQuery;
  }

  generateDeleteDepartment(departmentId) {
    let sqlQuery = `
      DELETE FROM "Department"
      WHERE id = ${departmentId};
    `;
    return sqlQuery;
  }

  generateCreateDepartment(data) {
    let keys = [];
    let values = [];

    for (let key in data) {
      keys.push(`"${key}"`);
      values.push(`'${data[key]}'`);
    }

    let sqlQuery = `
      INSERT INTO "Department"(${keys.join(', ')})
        values (${values.join(', ')});
    `;
    return sqlQuery;
  }
}
