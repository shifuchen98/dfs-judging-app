import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import TopNav from './commons/TopNav';
import SideNav from './commons/SideNav';

import AuthPage from './AuthPage';
import EventsPage from './EventsPage';
import JudgesPage from './JudgesPage';
import TeamsPage from './TeamsPage';
import AssignPage from './AssignPage';
import TotalPage from './TotalPage';
import ExportPage from './ExportPage';
import WinnerPage from './WinnerPage';
import PresentationPage from './PresentationPage';

import AV from 'leancloud-storage';

import './style.css';

AV.init({
  appId: 'DYL9yvHhYIFt50o5MGIeGwKh-MdYXbMMI',
  appKey: '1Np84YHTVsUEs2hmCWspVxMK'
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideNavOn: false
    };
    this.openSideNav = this.openSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
  }

  openSideNav() {
    this.setState({ sideNavOn: true });
  }

  closeSideNav() {
    this.setState({ sideNavOn: false });
  }

  render() {
    const { sideNavOn } = this.state;
    return (
      <Router>
        <Route path="/event/:id" render={(props) => <TopNav {...props} sideNavOn={sideNavOn} openSideNav={this.openSideNav} closeSideNav={this.closeSideNav} />} />
        <Route path="/event/:id" render={(props) => <SideNav {...props} sideNavOn={sideNavOn} closeSideNav={this.closeSideNav} />} />
        <Switch>
          <Route exact path="/">
            <div className="auth-wrapper">
              <Route exact path="/" component={AuthPage} />
            </div>
          </Route>
          <Route exact path="/events">
            <div className="auth-wrapper">
              <Route exact path="/events" component={EventsPage} />
            </div>
          </Route>
          <Route path="/event/:id">
            <div className="basic-wrapper">
              <Switch>
                <Route exact path="/event/:id/judges" component={JudgesPage} />
                <Route exact path="/event/:id/teams" component={TeamsPage} />
                <Route exact path="/event/:id/assign" component={AssignPage} />
                <Route exact path="/event/:id/total" component={TotalPage} />
                <Route exact path="/event/:id/export" component={ExportPage} />
                <Route exact path="/event/:id/winner" component={WinnerPage} />
                <Route exact path="/event/:id/presentation" component={PresentationPage} />
                <Redirect to="/event/:id/judges" />
              </Switch>
            </div>
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}
