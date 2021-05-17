module.exports = class GenerateQueriesAppointment {
  constructor() { }

  generateCreateAppointment(data) {
    let keys = [];
    let values = [];

    for (let key in data) {
      keys.push(`"${key}"`);
      values.push(`'${data[key]}'`);
    }

    let sqlQuery = `
      INSERT INTO "Appointment"(${keys.join(', ')})
        values (${values.join(', ')});
    `;
    return sqlQuery;
  }

  generateGetAppointment(appointmentId) {
    let sqlQuery = `
      SELECT * FROM "Appointment"
      ${(appointmentId !== -1)
        ? `WHERE id = ${appointmentId}`
        : ''
      }
      ORDER BY id DESC;
    `;
    return sqlQuery;
  }

  generateGetDoctorAppointment(doctorId) {
    let sqlQuery = `
      SELECT * FROM "Appointment"
      WHERE "doctorId" = ${doctorId}  
      ORDER BY id DESC;
    `;
    return sqlQuery;
  }

  generateDeleteAppointment(appointmentId) {
    let sqlQuery = `
      DELETE FROM "Appointment"
      WHERE id = ${appointmentId};
    `;
    return sqlQuery;
  }
}
