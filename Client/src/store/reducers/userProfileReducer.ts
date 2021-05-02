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

  // For doctor and admin
  locationId?: number;
  location?: Location;
  appointmentProcedures?: Array<AppointmentProcedure>;

  // For patient
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
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

  // For doctor and admin
  locationId: -1,
  location: undefined,
  appointmentProcedures: undefined,

  // For patient
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
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
