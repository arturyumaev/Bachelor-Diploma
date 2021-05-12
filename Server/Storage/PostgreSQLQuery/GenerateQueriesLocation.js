module.exports = class GenerateQueriesLocation {
  constructor() { }

  generateGetLocation(locationId) {
    let sqlQuery = `
      SELECT * FROM "Location"
      ${(locationId !== -1)
        ? `WHERE id = ${locationId}`
        : ''
      }
      ORDER BY id DESC;
    `;
    return sqlQuery;
  }

  generateDeleteLocation(locationId) {
    let sqlQuery = `
      DELETE FROM "Location"
      WHERE id = ${locationId};
    `;
    return sqlQuery;
  }
}
