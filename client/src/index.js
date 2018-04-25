import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './views/App';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom';
import configureStore from './redux/store';
import Provider from 'react-redux/es/components/Provider';

const store = configureStore();

ReactDOM.render((
        <Provider store={ store }>
            <HashRouter>
                <Switch>
                    <Route path="/*" component={ App } />
                </Switch>
            </HashRouter>
        </Provider>
    ),
    document.getElementById('root'));
