import Appointment from "./Appointment/Appointment";
import Gender from "./Utils/Gender";
import WithId from "./WithId";

export default interface Patient extends WithId {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    appointments: Array<Appointment>;
    gender: Gender;
    birthDate: number;
    address: string;

    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
}