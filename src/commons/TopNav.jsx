import React from 'react';
import {
  NavLink as RouteLink,
} from 'react-router-dom';

import AV from 'leancloud-storage';

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
    AV.User.logOut().then(() => {
      history.push('/');
    });
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
            <a onClick={this.logOut}>
              <span>Log out</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
