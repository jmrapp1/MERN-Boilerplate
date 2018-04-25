import React from 'react';
import PropTypes from 'prop-types';
import './SecondaryButton.css';

const SecondaryButton = ({ text, onClick, className }) => (
    <button className={ 'button button-secondary ' + className } onClick={ onClick }>{ text }</button>
);

SecondaryButton.propTypes = {
    text: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default SecondaryButton;