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
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    const { history } = this.props;
    history.push('/'); // Implement auth
  }

  render() {
    const { sideNavOn, openSideNav, closeSideNav } = this.props;
    return (
      <nav className="top-nav">
        <ul id="top-nav__left">
          <li id="top-nav__menu">
            <button onClick={sideNavOn ? closeSideNav : openSideNav}>
              <span>Menu</span>
            </button>
          </li>
          <li>
            <RouteLink to="/events">
              <span>All Events</span>
            </RouteLink>
          </li>
        </ul>
        <ul id="top-nav__right">
          <li>
            <button onClick={this.logOut}>
              <span>Log out</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}