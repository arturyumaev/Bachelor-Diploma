import User from "./User";

export default interface Patient extends User {
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}