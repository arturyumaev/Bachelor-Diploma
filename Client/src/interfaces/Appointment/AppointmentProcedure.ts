import WithId from "../WithId";

export default interface AppointmentProcedure extends WithId {
  name: string;
  duration: number;
  price: number;
  notes: string;

  doctorId: number;
  locationId: number;
  roomId: number;
  departmentId: number;
}
