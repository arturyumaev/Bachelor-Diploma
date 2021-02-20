import Appointment from "./Appointment/Appointment";
import User from "./User";
import Gender from "./Utils/Gender";
import WithId from "./WithId";

export default interface Patient extends User {
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
}