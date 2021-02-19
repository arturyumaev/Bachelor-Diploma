import WithId from "./WithId";
import User from "./User";

export default interface Admin extends WithId, User {
  locationId: number;
  location: Location;
}