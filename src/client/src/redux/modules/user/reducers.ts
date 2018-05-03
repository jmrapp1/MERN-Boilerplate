import { REGISTER, LOGIN } from './constants';
const jwtDecode = require('jwt-decode');

const initialState = {
    user: {},
    loggedIn: false
};

export const register = data => (
    { type: REGISTER, data }
);

export const login = user => (
    { type: LOGIN, user }
);

export default {
    user: ( state = initialState, action ) => {
        switch (action.type) {
            case LOGIN: {
                return {
                    user: action.user,
                    loggedIn: true
                }
            }
            case REGISTER: {
                return state; // Keep same state
            }
            default:
                return state;
        }
    }
}