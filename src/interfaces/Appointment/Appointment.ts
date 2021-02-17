import AppointmentProcedure from './AppointmentProcedure';
import WithId from '../WithId';
import Doctor from '../Doctor';
import AppointmentStatus from './AppointmentStatus';
import Location from '../Location';
import Patient from '../Patient';

interface Appointment extends WithId {
    name: string;
    time: number;
    duration: number;
    status: AppointmentStatus;
    notes: string;

    patient?: Patient;
    patientId: number;

    doctor?: Doctor;
    doctorId: number;

    location?: Location;
    locationId: number;

    procedures?: Array<AppointmentProcedure>;
}

export default Appointment;