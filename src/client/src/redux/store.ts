import {applyMiddleware, compose, createStore} from 'redux';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import thunk from 'redux-thunk';
import reducers from './reducers';

const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const engine = createEngine('boilerplate-store');
const storageMiddleware = storage.createMiddleware(engine);

export default function configureStore() {
    const store = createStore(
        reducers,
        composeEnhancer(applyMiddleware(thunk, storageMiddleware))
    );
    const load = storage.createLoader(engine);
    load(store);
    return store;
}
