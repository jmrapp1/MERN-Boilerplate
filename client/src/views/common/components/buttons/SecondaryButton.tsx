import * as React from 'react';
import './SecondaryButton.css';

const SecondaryButton = ({ text, onClick, className }) => (
    <button className={ 'button button-secondary ' + className } onClick={ onClick }>{ text }</button>
);

export default SecondaryButton;
