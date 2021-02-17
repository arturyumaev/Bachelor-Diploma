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
    procedures: Array<AppointmentProcedure>;
    status: AppointmentStatus;
    notes: string;

    patient: Patient;
    patientId: number;

    doctor: Doctor;
    doctorId: number;

    location: Location;
    locationId: number;
}

export default Appointment;