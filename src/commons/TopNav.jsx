import React from "react";
import { NavLink as RouteLink } from "react-router-dom";

import AV from "leancloud-storage/live-query";

import "../style.css";

export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      roles: [],
      event: AV.Object.createWithoutData("Event", match.params.id),
      judgingTimeLeft: ""
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.updateJudgingTimeLeft = this.updateJudgingTimeLeft.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push("/");
    } else {
      AV.User.current()
        .getRoles()
        .then(roles => {
          this.setState({ roles }, () => {
            this.interval = setInterval(this.updateJudgingTimeLeft, 1000);
            this.fetchEvent();
          });
        });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchEvent() {
    const { event } = this.state;
    const eventsQuery = new AV.Query("Event");
    eventsQuery
      .equalTo("objectId", event.id)
      .first()
      .then(event => {
        this.setState({ event });
      })
      .catch(error => {
        alert(error);
      });
    eventsQuery
      .subscribe()
      .then(liveQuery => {
        liveQuery.on("update", event => {
          this.setState({ event });
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  updateJudgingTimeLeft() {
    const { event } = this.state;
    this.setState({
      judgingTimeLeft:
        event.get("judgingDuesAt") > new Date()
          ? `${Math.floor(
              (event.get("judgingDuesAt") - new Date()) / 60000
            )}:${`0${Math.floor(
              (((event.get("judgingDuesAt") - new Date()) % 86400000) % 60000) /
                1000
            )}`.slice(-2)}`
          : ""
    });
  }

  logOut() {
    const { history } = this.props;
    AV.User.logOut().then(() => {
      history.push("/");
    });
  }

  render() {
    const { sideNavOn, openSideNav, closeSideNav } = this.props;
    const { roles, event, judgingTimeLeft } = this.state;
    return (
      <nav className="top-nav">
        <ul id="top-nav__left">
          <li id="top-nav__menu">
            <button onClick={sideNavOn ? closeSideNav : openSideNav}>
              <span>
                {roles.filter(role => role.get("name") === "Admin").length
                  ? "Menu"
                  : "Teams"}
              </span>
            </button>
          </li>
          <li>
            <RouteLink to="/events">
              <span>
                All Events
                <span className="top-nav__extra">
                  {" "}
                  (
                  {judgingTimeLeft
                    ? `${event.get("name")}, ${judgingTimeLeft}`
                    : event.get("name")}
                  )
                </span>
              </span>
            </RouteLink>
          </li>
        </ul>
        <ul id="top-nav__right">
          {AV.User.current() ? (
            <li>
              <button onClick={this.logOut}>
                <span>
                  Log out
                  <span className="top-nav__extra">
                    {" "}
                    ({AV.User.current().get("name")})
                  </span>
                </span>
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
    );
  }
}
