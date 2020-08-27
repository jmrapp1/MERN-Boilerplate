import { combineReducers } from 'redux';
import { Reducer as UserReducer } from './modules/user';

export default combineReducers({
    ...UserReducer
});
