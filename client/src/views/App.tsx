import * as React from 'react';
import './App.css';
import { connect } from 'react-redux';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app' className='container-fluid'>
                <p>Welcome to my react and node website! Update</p>
            </div>
        );
    }
}

export default connect()(App);
