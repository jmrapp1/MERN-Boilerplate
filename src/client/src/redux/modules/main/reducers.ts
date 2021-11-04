import { LOAD } from 'redux-storage';

const initialState = {
    reduxStorageLoaded: false
};

export default {
    main: ( state = initialState, action ) => {
        switch (action.type) {
            case LOAD: {
                return {
                    ...state,
                    reduxStorageLoaded: true
                }
            }
            default:
                return state;
        }
    }
}
