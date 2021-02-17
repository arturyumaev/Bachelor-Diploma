import AppointmentProcedure from "./Appointment/AppointmentProcedure";
import User from "./User";
import WithId from "./WithId";

export default interface Doctor extends WithId, User {
    locationId: number;
    location: Location;

    appointmentProcedures: Array<AppointmentProcedure>;
}

