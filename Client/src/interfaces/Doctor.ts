import AppointmentProcedure from "./Appointment/AppointmentProcedure";
import User from "./User";

export default interface Doctor extends User {
    locationId: number;
    location: Location;

    appointmentProcedures: Array<AppointmentProcedure>;
}

