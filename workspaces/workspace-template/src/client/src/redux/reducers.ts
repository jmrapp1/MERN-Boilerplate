import { combineReducers } from 'redux';
import { Reducer as UserReducer } from '@modulfy/client-user';

export default combineReducers({
    ...UserReducer
});
