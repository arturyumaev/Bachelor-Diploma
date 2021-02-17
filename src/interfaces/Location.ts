import WithId from "./WithId";

export default interface Location extends WithId {
    locationName: string;
    address: string;
    phone: string;
}

