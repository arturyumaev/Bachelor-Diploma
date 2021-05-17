import { combineReducers } from 'redux';
import { userProfile } from './userProfileReducer';
import { selectedDoctor } from './selectedDoctor';

const rootReducer = combineReducers({
  userProfile,
  selectedDoctor,
});

export default rootReducer;
