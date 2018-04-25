import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

export default function configureStore() {
    return createStore(
        reducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        applyMiddleware(thunk)
    );
}