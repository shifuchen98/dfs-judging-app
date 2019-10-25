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
    this.pages = [
      {
        name: "Judges",
        path: "judges",
      },
      {
        name: "Teams",
        path: "teams",
      },
      {
        name: "Assign Teams",
        path: "assign",
      },
      {
        name: "Criteria",
        path: "criteria",
      },
      {
        name: "Total Score",
        path: "total",
      },
      {
        name: "Export",
        path: "export",
      },
      {
        name: "Winner",
        path: "winner",
      },
      {
        name: "Presentation",
        path: "presentation",
      },
    ];
  }

  render() {
    const { match, sideNavOn, closeSideNav } = this.props;
    return (
      <nav className={sideNavOn ? 'side-nav on' : 'side-nav'}>
        <div id="side-nav__logo">
          <img src={require('../assets/logo.png')} alt="Dreams for Schools" />
        </div>
        <ul id="side-nav__pages">
          {this.pages.map(page =>
            <li key={page.path}>
              <RouteLink to={`/event/${match.params.id}/${page.path}`} onClick={closeSideNav}>
                <span>{page.name}</span>
              </RouteLink>
            </li>
          )}
        </ul>
      </nav>
    );
  }
}
