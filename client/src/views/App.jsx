import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="app" className="container-fluid">
                <p>Welcome to my react & node website!</p>
            </div>
        );
    }
}

App.propTypes = {
};

export default connect()(App);