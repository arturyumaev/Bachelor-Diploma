import User from "./User";

export default interface Admin extends User {
  locationId: number;
  location: Location;
}