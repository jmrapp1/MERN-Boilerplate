import * as React from 'react';
import './PageButton.scss';

const PageButton = ({ text, onClick, className }) => (
    <button className={ 'button button-page ' + className } onClick={ onClick }>{ text }</button>
);

export default PageButton;
