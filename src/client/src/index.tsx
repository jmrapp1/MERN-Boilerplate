import * as React from 'react';
import { render } from 'react-dom';
import App from './views/App';
import { HashRouter, Switch, Route } from 'react-router-dom';
import configureStore from './redux/store';
import Provider from 'react-redux/es/components/Provider';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const store = configureStore();

render((
        <Provider store={ store }>
            <HashRouter>
                <Switch>
                    <Route path='/*' component={ App }/>
                </Switch>
            </HashRouter>
        </Provider>
    ),
    document.getElementById('root'));
