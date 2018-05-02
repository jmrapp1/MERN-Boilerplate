import * as React from 'react';
import './Container.scss';

const Container = ({ children, padding = 30, className = '', shadow = true, round = true }) => (
    <div className={ 'Container ' + className + (shadow ? ' container-shadow' : '') + (round ? ' container-round' : '') } style={ { padding } }>
        { children }
    </div>
);

export default Container;
