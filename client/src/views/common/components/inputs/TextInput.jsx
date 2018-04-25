import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

const TextInput = ({ name, placeholder = "", value = "", type = "text", onChange = () => {} }) => (
    <input className="textInput" name={ name } placeholder={ placeholder } value={ value } onChange={ onChange } type={ type } />
);

TextInput.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string
};

export default TextInput;