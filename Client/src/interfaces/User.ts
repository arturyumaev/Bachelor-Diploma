import AccessControl from "./Utils/AccessControl";
import Gender from "./Utils/Gender";
import WithId from "./WithId";

export default interface User extends WithId {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: number;
  address: string;
  
  login: string;
  hashsum: string;
  accessControl: AccessControl;
}