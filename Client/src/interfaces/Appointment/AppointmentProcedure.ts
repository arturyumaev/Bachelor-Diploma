import Doctor from "../Doctor";
import Location from "../Location";
import { Room } from "../Room";
import WithId from "../WithId";

export default interface AppointmentProcedure extends WithId {
  name: string;
  duration: number;
  price: number;
  notes: string;
  doctorId: number;
  locationId: number;
  roomId: number;

  doctor?: Doctor;
  location?: Location;
  room?: Room;
}
