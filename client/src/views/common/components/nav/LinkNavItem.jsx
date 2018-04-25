import React from "react";
import { Route } from "react-router-dom";
import { NavItem } from "react-bootstrap";
import PropTypes from 'prop-types';

const LinkNavItem = props => (

    <Route
        path={ props.href }
        exact
        children={ ({ match, history }) =>
            <NavItem
                onClick={ e => history.push(e.currentTarget.getAttribute("href")) }
                { ...props }
                active={ !!match }
            >
                { props.children }
            </NavItem>
        }
    />
);

LinkNavItem.propTypes = {
    children: PropTypes.node,
    href: PropTypes.string
};

export default LinkNavItem;
