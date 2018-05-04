import { dispatchRequest } from '../../utils/fetchUtils';
import UserRegisterResource from '../../../../../shared/resources/user/UserRegisterResource';
import * as Reducer from './reducers';
import UserLoginResource from '../../../../../shared/resources/user/UserLoginResource';
import UserRegisterMapper from '../../../../../shared/mappers/user/UserRegisterMapper';
import { BadRequestError } from '../../../../../shared/errors/BadRequestError';
import UserLoginMapper from '../../../../../shared/mappers/user/UserLoginMapper';
const jwtDecode = require('jwt-decode');

export function register(registerResource: UserRegisterResource, successCallback, errorCallback) {
    return dispatch => {
        const localErrors = UserRegisterMapper.verifyAllConstraints(registerResource);
        if (localErrors) return errorCallback(new BadRequestError(localErrors));
        return dispatchRequest('api/user/register', 'POST', JSON.parse(JSON.stringify(registerResource)), data => {
            successCallback(data);
            Reducer.register(data);
        }, err => {
            errorCallback(err);
        });
    }
}

export function login(loginResource: UserLoginResource, successCallback, errorCallback) {
    return dispatch => {
        const localErrors = UserLoginMapper.verifyAllConstraints(loginResource);
        if (localErrors) return errorCallback(new BadRequestError(localErrors));
        return dispatchRequest('api/user/login', 'POST', JSON.parse(JSON.stringify(loginResource)), data => {
            localStorage.setItem('id_token', data.jwtToken);
            decodeUserDataToStoreFromLocal(dispatch);
            successCallback(data);
        }, err => {
            errorCallback(err);
        });
    }
}

export function decodeUserDataToStoreFromLocal(dispatch) {
    const token = localStorage.getItem('id_token');
    if (token) {
        const user = jwtDecode(token);
        dispatch(Reducer.login(user));
        return user;
    }
}
