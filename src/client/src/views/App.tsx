import * as React from 'react';
import './App.scss';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Route, Switch } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';

class App extends React.Component<{ history }> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app' className='container-fluid'>
                <ToastContainer autoClose={ 3000 }/>
                <div id='content'>
                    <Switch>
                        <Route exact path='/register' component={ RegisterPage }/>
                        <Route path='/*' component={ LoginPage }/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default connect()(App);
