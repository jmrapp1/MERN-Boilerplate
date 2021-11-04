import { combineReducers } from 'redux';
import * as storage from 'redux-storage'
import { Reducer as UserReducer } from './modules/user/';
import MainReducer from './modules/main/reducers';

export default storage.reducer(combineReducers({
    ...MainReducer,
    ...UserReducer
}));
