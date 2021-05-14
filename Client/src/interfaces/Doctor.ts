import User from "./User";

export default interface Doctor extends User {
  locationId: number;
  departmentId: number;
  workExperience: number;
  academicDegree: string;
  notes: string;
}
