import AppointmentProcedure from './AppointmentProcedure';
import WithId from '../WithId';
import Doctor from '../Doctor';

interface Appointment extends WithId {
    name: string;
    doctor: Doctor;
    date: number;
    duration: number;
    procedures: Array<AppointmentProcedure>;
}

export default Appointment;