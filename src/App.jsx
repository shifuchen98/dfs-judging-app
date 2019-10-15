import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import TopNav from "./commons/TopNav";
import SideNav from "./commons/SideNav";

import AuthPage from "./AuthPage";
import EventsPage from "./EventsPage";
import JudgesPage from "./JudgesPage";
import TeamsPage from "./TeamsPage";
import AssignPage from "./AssignPage";
import TotalPage from "./TotalPage";
import ExportPage from "./ExportPage";
import WinnerPage from "./WinnerPage";
import PresentationPage from "./PresentationPage";
import withAuthProtection from "./withAuthProtection";
import firebase from "./Auth.js";
import "./style.css";

const ProtectedEvents = withAuthProtection("/")(EventsPage);
const ProtectedJudges = withAuthProtection("/")(JudgesPage);
const ProtectedTeams = withAuthProtection("/")(TeamsPage);
const ProtectedAssign = withAuthProtection("/")(AssignPage);
const ProtectedTotal = withAuthProtection("/")(TotalPage);
const ProtectedExport = withAuthProtection("/")(ExportPage);
const ProtectedWinner = withAuthProtection("/")(WinnerPage);
const ProtectedPresentation = withAuthProtection("/")(PresentationPage);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      sideNavOn: false
    };
    this.db = firebase.firestore();
    this.openSideNav = this.openSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        // localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        // localStorage.removeItem('user');
      }
    });
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
        <Route
          path="/event/:id"
          render={props => (
            <TopNav
              {...props}
              sideNavOn={sideNavOn}
              openSideNav={this.openSideNav}
              closeSideNav={this.closeSideNav}
            />
          )}
        />
        <Route
          path="/event/:id"
          render={props => (
            <SideNav
              {...props}
              sideNavOn={sideNavOn}
              closeSideNav={this.closeSideNav}
            />
          )}
        />
        <Switch>
          <Route exact path="/">
            <div className="auth-wrapper">
              <Route exact path="/" component={AuthPage} />
            </div>
          </Route>
          <Route exact path="/events">
            <div className="auth-wrapper">
              <Route
                exact
                path="/events"
                render={props => (
                  <ProtectedEvents user={this.state.user} {...props} />
                )}
              />
            </div>
          </Route>
          <Route path="/event/:id">
            <div className="basic-wrapper">
              <Switch>
                <Route
                  exact
                  path="/event/:id/judges"
                  render={props => (
                    <ProtectedJudges user={this.state.user} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/event/:id/teams"
                  render={props => (
                    <ProtectedTeams user={this.state.user} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/event/:id/assign"
                  render={props => (
                    <ProtectedAssign user={this.state.user} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/event/:id/total"
                  render={props => (
                    <ProtectedTotal user={this.state.user} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/event/:id/export"
                  render={props => (
                    <ProtectedExport user={this.state.user} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/event/:id/winner"
                  render={props => (
                    <ProtectedWinner user={this.state.user} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/event/:id/presentation"
                  render={props => (
                    <ProtectedPresentation user={this.state.user} {...props} />
                  )}
                />
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
