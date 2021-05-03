module.exports = class GenerateQueriesCommon {
  constructor() { }

  updateUserColumns(id, table, data) {
    const updatedColumns = [];
    for (let key in data) {
      (key !== 'id' && key !== 'accessControl') &&
        updatedColumns.push(`"${key}" = '${data[key]}'`)
    }

    let sqlQuery = `
      UPDATE "${table}"
      SET ${updatedColumns.join(', ')}
      WHERE id = ${id};
    `;

    return sqlQuery;
  }

  generateGetUserInfo(id, table) {
    let sqlQuery = `
      SELECT * FROM "${table}"
      WHERE id = '${id}';
    `;
    console.log(sqlQuery);
    return sqlQuery;
  }
}
