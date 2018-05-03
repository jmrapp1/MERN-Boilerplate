import * as React from 'react';
import './AlertButton.scss';

const AlertButton = ({ text, onClick, className }) => (
    <button className={ 'button button-alert ' + className } onClick={ onClick }>{ text }</button>
);

export default AlertButton;
