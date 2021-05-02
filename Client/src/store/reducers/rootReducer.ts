import { combineReducers } from 'redux';
import { userProfile } from './userProfileReducer';

const rootReducer = combineReducers({
  userProfile,
});

export default rootReducer;
