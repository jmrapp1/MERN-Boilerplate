import React from 'react';
import PropTypes from 'prop-types';
import './PageButton.css';

const PageButton = ({ text, onClick, className }) => (
    <button className={ 'button button-page ' + className } onClick={ onClick }>{ text }</button>
);

PageButton.propTypes = {
    text: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default PageButton;