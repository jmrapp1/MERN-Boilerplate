import React from 'react';
import PropTypes from 'prop-types';
import './Container.css';

const Container = ({ children, padding = 30, className = '', shadow = true, round = true }) => (
    <div className={ 'Container ' + className + (shadow ? " container-shadow" : "") + (round ? " container-round" : "") } style={ { padding } }>
        { children }
    </div>
);

Container.propTypes = {
    children: PropTypes.node,
    padding: PropTypes.number,
    className: PropTypes.string,
    shadow: PropTypes.bool,
    round: PropTypes.bool
};

export default Container;