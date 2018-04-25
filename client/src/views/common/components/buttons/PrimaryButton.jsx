import React from 'react';
import PropTypes from 'prop-types';
import './PrimaryButton.css';

const PrimaryButton = ({ text, onClick, className }) => (
    <button className={ 'button button-primary ' + className } onClick={ onClick }>{ text }</button>
);

PrimaryButton.propTypes = {
    text: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default PrimaryButton;