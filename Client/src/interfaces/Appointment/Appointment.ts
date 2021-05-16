import WithId from '../WithId';

interface Appointment extends WithId {
  scheduledTime:string;
  scheduledEndTime: string;
  created: string;
  notes: string;

  patientId: number;
  doctorId: number;
  appointmentProcedureId: number;
  roomId: number;
}

export default Appointment;
