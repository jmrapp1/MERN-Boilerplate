import * as React from 'react';
import './PrimaryButton.scss';

const PrimaryButton = ({ text, onClick, className = '' }) => (
    <button className={ 'button button-primary ' + className } onClick={ onClick }>{ text }</button>
);

export default PrimaryButton;
