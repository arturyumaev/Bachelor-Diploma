import AccessControl from "./Utils/AccessControl";
import Gender from "./Utils/Gender";

export default interface User {
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