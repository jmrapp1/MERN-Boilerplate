import React from 'react';
import PropTypes from 'prop-types';
import './AlertButton.css';

const AlertButton = ({ text, onClick, className }) => (
    <button className={ 'button button-alert ' + className } onClick={ onClick }>{ text }</button>
);

AlertButton.propTypes = {
    text: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default AlertButton;