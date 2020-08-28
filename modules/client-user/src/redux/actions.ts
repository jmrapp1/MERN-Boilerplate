import {
    UserRegisterResource,
    UserLoginResource,
    UserRegisterMapper,
    UserLoginMapper
} from '@modulfy/shared-resources-user';
const jwtDecode = require('jwt-decode');
import * as Reducer from './reducers';
import { BadRequestError } from '@modulfy/shared-core-resources';
import { dispatchPostRequest, FetchMiddleware } from '@modulfy/client-core-fetch';

const LOCAL_STORAGE_AUTH_NAME = 'auth_token';
FetchMiddleware.addFetchMiddleware(authFetchMiddleware);

export function register(registerResource: UserRegisterResource, successCallback, errorCallback) {
    return dispatch => {
        const localErrors = UserRegisterMapper.verifyAllConstraints(registerResource);
        if (localErrors) return errorCallback(new BadRequestError(localErrors));
        return dispatchPostRequest('api/user/register', JSON.parse(JSON.stringify(registerResource)), data => {
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
        return dispatchPostRequest('api/user/login', JSON.parse(JSON.stringify(loginResource)), data => {
            localStorage.setItem(LOCAL_STORAGE_AUTH_NAME, data.jwtToken);
            decodeUserDataToStoreFromLocal(dispatch);
            successCallback(data);
        }, err => {
            errorCallback(err);
        });
    }
}

export function authFetchMiddleware(route: string, method: string, body, headers) {
    const auth = localStorage.getItem(LOCAL_STORAGE_AUTH_NAME);
    if (auth) {
        headers.Authorization = auth
    }
}

export function decodeUserDataToStoreFromLocal(dispatch) {
    const token = localStorage.getItem(LOCAL_STORAGE_AUTH_NAME);
    if (token) {
        const user = jwtDecode(token);
        dispatch(Reducer.login(user));
        return user;
    }
}
