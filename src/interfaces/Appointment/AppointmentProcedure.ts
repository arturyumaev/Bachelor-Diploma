import Doctor from "../Doctor";
import Currency from "../Utils/Currency";
import WithId from "../WithId";

export default interface AppointmentProcedure extends WithId {
    procedureName: string;
    doctor: Doctor;
    doctorId: number;
    duration: number;
    room: string;
    price: number;
    currency: Currency;
}

