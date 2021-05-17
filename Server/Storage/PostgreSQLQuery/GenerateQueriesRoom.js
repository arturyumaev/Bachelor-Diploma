module.exports = class GenerateQueriesRoom {
  constructor() { }

  generateGetRoom(roomId) {
    let sqlQuery = `
      SELECT * FROM "Room"
      ${(roomId !== -1)
        ? `WHERE id = ${roomId}`
        : ''
      }
      ORDER BY id DESC;
    `;
    return sqlQuery;
  }

  generateDeleteRoom(roomId) {
    let sqlQuery = `
      DELETE FROM "Appointment"
      WHERE "roomId" = ${roomId};

      DELETE FROM "Room"
      WHERE id = ${roomId};
    `;
    return sqlQuery;
  }

  generateCreateRoom(data) {
    let keys = [];
    let values = [];

    for (let key in data) {
      keys.push(`"${key}"`);
      values.push(`'${data[key]}'`);
    }

    let sqlQuery = `
      INSERT INTO "Room"(${keys.join(', ')})
        values (${values.join(', ')});
    `;
    return sqlQuery;
  }
}
