import {applyMiddleware, compose, createStore} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
    return createStore(
        reducers,
        composeEnhancer(applyMiddleware(thunk))
    );
}
