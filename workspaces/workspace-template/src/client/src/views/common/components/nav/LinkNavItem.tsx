import * as React from 'react';
import { Route } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';

const LinkNavItem = props => (

    <Route
        path={ props.href }
        exact
        children={ ({ match, history }) =>
            <NavItem
                onClick={ e => history.push(e.currentTarget.getAttribute('href')) }
                { ...props }
                active={ !!match }
            >
                { props.children }
            </NavItem>
        }
    />
);

export default LinkNavItem;
