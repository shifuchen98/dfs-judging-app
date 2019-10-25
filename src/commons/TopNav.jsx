import React from 'react';
import {
  NavLink as RouteLink,
} from 'react-router-dom';

import AV from 'leancloud-storage';

import '../style.css';

export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      event: AV.Object.createWithoutData('Event', match.params.id),
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    this.fetchEvent();
  }

  fetchEvent() {
    const { event } = this.state;
    event
      .fetch()
      .then(event => {
        this.setState({ event });
      })
      .catch(error => {
        alert(error);
      });
  }

  logOut() {
    const { history } = this.props;
    AV.User.logOut().then(() => {
      history.push('/');
    });
  }

  render() {
    const { sideNavOn, openSideNav, closeSideNav } = this.props;
    const { event } = this.state;
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
              <span>All Events<span className="top-nav__extra"> ({event.get('name')})</span></span>
            </RouteLink>
          </li>
        </ul>
        <ul id="top-nav__right">
          <li>
            <button onClick={this.logOut}>
              <span>Log out<span className="top-nav__extra"> ({AV.User.current().get('name')})</span></span>
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}
