import { ICommonUser } from "../../reducers/userProfileReducer";

const updateUser = (payload: ICommonUser) => {
  return {
    type: 'UPDATE_USER',
    payload
  }
}

export default updateUser;