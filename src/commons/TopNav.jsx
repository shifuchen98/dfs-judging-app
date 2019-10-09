import React from 'react';
import {
  NavLink as RouteLink,
} from 'react-router-dom';

import '../style.css';

export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { sideNavOn, openSideNav, closeSideNav } = this.props;
    return (
      <nav className="top-nav">
        <ul id="top-nav__left">
          <li id="top-nav__menu">
            <a onClick={sideNavOn ? closeSideNav : openSideNav}>
              <span>Menu</span>
            </a>
          </li>
          <li>
            <RouteLink to="/events">
              <span>All Events</span>
            </RouteLink>
          </li>
        </ul>
        <ul id="top-nav__right">
          <li>
            <a href="/">
              <span>Log out</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
