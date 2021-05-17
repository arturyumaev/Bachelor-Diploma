import { AnyAction } from "redux";
import AppointmentProcedure from "../../interfaces/Appointment/AppointmentProcedure";
import AccessControl from "../../interfaces/Utils/AccessControl";
import Gender from "../../interfaces/Utils/Gender";

export type ICommonUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: string;
  address: string;
  username: string;
  hashsum: string;
  accessControl?: AccessControl;

  // For both doctor and admin
  locationId?: number;
  appointmentProcedures?: Array<AppointmentProcedure>;

  // For patient
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // For doctor only
  departmentId?: number;
  workExperience?: number;
  academicDegree?: string;
  notes?: string;
};

const initialState: ICommonUser = {
  id: -1,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: Gender.Other,
  birthDate: '',
  address: '',
  username: '',
  hashsum: '',
  accessControl: undefined,

  // For both doctor and admin
  locationId: -1,
  appointmentProcedures: undefined,

  // For patient
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',

  // For doctor only
  departmentId: -1,
  workExperience: 0,
  academicDegree: '',
  notes: '',
}

export function userProfile(state: ICommonUser = initialState, action: AnyAction) {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, ...action.payload };
    case 'INIT':
      return initialState;
    default:
      return state;
  };
};
