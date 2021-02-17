import AppointmentProcedure from "./Appointment/AppointmentProcedure";
import WithId from "./WithId";

export default interface Doctor extends WithId {
    firstName: string;
    lastName: string;
    location: Location;
    email: string;
    phone: string;

    appointmentProcedures: Array<AppointmentProcedure>;
}

