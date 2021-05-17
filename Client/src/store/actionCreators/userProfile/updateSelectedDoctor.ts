import { IState } from "../../reducers/selectedDoctor";

const updateDoctor = (payload: IState) => {
  return {
    type: 'UPDATE_SELECTED_DOCTOR',
    payload
  }
}

export default updateDoctor;
