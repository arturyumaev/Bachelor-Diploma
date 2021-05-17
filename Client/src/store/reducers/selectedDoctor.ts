import { AnyAction } from "redux";

export interface IState {
  doctorId?: number;
  departmentId?: number;
}

const initialState = {
  doctorId: undefined,
  departmentId: undefined,
}

export function selectedDoctor(state: IState = initialState, action: AnyAction) {
  switch (action.type) {
    case 'UPDATE_SELECTED_DOCTOR':
      return { ...state, ...action.payload };
    case 'INIT':
      return initialState;
    default:
      return state;
  };
};
