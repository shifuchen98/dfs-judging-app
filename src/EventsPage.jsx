import React from "react";

import AV from "leancloud-storage/live-query";

import "./style.css";

export default class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      events: [],
      eventsSearch: "",
      showingPastEvents: false,
      eventName: "",
      eventDate: "",
      eventLocation: ""
    };
    this.fetchEvents = this.fetchEvents.bind(this);
    this.handleEventsSearchChange = this.handleEventsSearchChange.bind(this);
    this.handleEventNameChange = this.handleEventNameChange.bind(this);
    this.handleEventDateChange = this.handleEventDateChange.bind(this);
    this.handleEventLocationChange = this.handleEventLocationChange.bind(this);
    this.showPastEvents = this.showPastEvents.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
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
          this.setState({ roles }, this.fetchEvents);
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  fetchEvents() {
    const { roles } = this.state;
    if (roles.filter(role => role.get("name") === "Admin").length) {
      const eventsQuery = new AV.Query("Event");
      eventsQuery
        .limit(1000)
        .find()
        .then(events => {
          this.setState({
            events: events.sort((a, b) => b.get("date") - a.get("date"))
          });
        })
        .catch(error => {
          alert(error);
        });
    } else {
      const eventJudgesQuery = new AV.Query("EventJudge");
      eventJudgesQuery
        .equalTo("user", AV.User.current())
        .include("event")
        .limit(1000)
        .find()
        .then(eventJudges => {
          this.setState({
            events: eventJudges
              .map(eventJudge => eventJudge.get("event"))
              .sort((a, b) => b.get("date") - a.get("date"))
          });
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  handleEventsSearchChange(e) {
    this.setState({ eventsSearch: e.target.value });
  }

  handleEventNameChange(e) {
    this.setState({ eventName: e.target.value });
  }

  handleEventDateChange(e) {
    this.setState({ eventDate: e.target.value });
  }

  handleEventLocationChange(e) {
    this.setState({ eventLocation: e.target.value });
  }

  showPastEvents() {
    this.setState({ showingPastEvents: true });
  }

  createEvent(e) {
    const { eventName, eventDate, eventLocation } = this.state;
    const event = new AV.Object("Event");
    event
      .set("name", eventName)
      .set(
        "date",
        new Date(
          eventDate.slice(0, 4),
          eventDate.slice(5, 7) - 1,
          eventDate.slice(8, 10)
        )
      )
      .set("location", eventLocation)
      .save()
      .then(() => {
        this.setState(
          { eventName: "", eventDate: "", eventLocation: "" },
          this.fetchEvents
        );
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  deleteEvent(event) {
    if (window.confirm(`Are you sure to delete ${event.get("name")}?`)) {
      event
        .destroy()
        .then(this.fetchEvents)
        .catch(error => {
          alert(error);
        });
    }
  }

  logOut() {
    const { history } = this.props;
    AV.User.logOut().then(() => {
      history.push("/");
    });
  }

  render() {
    const { history } = this.props;
    const {
      roles,
      events,
      eventsSearch,
      showingPastEvents,
      eventName,
      eventDate,
      eventLocation
    } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column column--thin">
            <div className="card card--center card--ghosted">
              <section className="fields">
                <div className="field">
                  <img
                    id="auth__logo"
                    src={require("./assets/logo.png")}
                    alt="Dreams for Schools"
                  />
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Select an Event</h1>
                <div className="field field--half">
                  <label>
                    <span>Search</span>
                    <input
                      type="text"
                      value={eventsSearch}
                      onChange={this.handleEventsSearchChange}
                    />
                  </label>
                </div>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Enter</th>
                        {roles.filter(role => role.get("name") === "Admin")
                          .length ? (
                          <th>Delete</th>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody>
                      {events
                        .filter(event =>
                          eventsSearch
                            ? event
                                .get("name")
                                .toLowerCase()
                                .includes(eventsSearch.toLowerCase())
                            : true
                        )
                        .filter(
                          event =>
                            event.get("date") >=
                              new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                new Date().getDate()
                              ) || showingPastEvents
                        )
                        .map(event => (
                          <tr key={event.id}>
                            <td>{event.get("name")}</td>
                            <td>
                              {event.get("date").toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                              })}
                            </td>
                            <td>{event.get("location")}</td>
                            <td>
                              <button
                                className="primary"
                                onClick={() => {
                                  history.push(`/event/${event.id}/info`);
                                }}
                              >
                                Enter
                              </button>
                            </td>
                            {roles.filter(role => role.get("name") === "Admin")
                              .length ? (
                              <td>
                                <button
                                  onClick={() => {
                                    this.deleteEvent(event);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {events
                  .filter(event =>
                    eventsSearch
                      ? event
                          .get("name")
                          .toLowerCase()
                          .includes(eventsSearch.toLowerCase())
                      : true
                  )
                  .filter(
                    event =>
                      event.get("date") <
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate()
                        ) && !showingPastEvents
                  ).length ? (
                  <div className="field">
                    <button onClick={this.showPastEvents}>
                      Show{" "}
                      {
                        events
                          .filter(event =>
                            eventsSearch
                              ? event
                                  .get("name")
                                  .toLowerCase()
                                  .includes(eventsSearch.toLowerCase())
                              : true
                          )
                          .filter(
                            event =>
                              event.get("date") <
                                new Date(
                                  new Date().getFullYear(),
                                  new Date().getMonth(),
                                  new Date().getDate()
                                ) && !showingPastEvents
                          ).length
                      }{" "}
                      Past{" "}
                      {events
                        .filter(event =>
                          eventsSearch
                            ? event
                                .get("name")
                                .toLowerCase()
                                .includes(eventsSearch.toLowerCase())
                            : true
                        )
                        .filter(
                          event =>
                            event.get("date") <
                              new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                new Date().getDate()
                              ) && !showingPastEvents
                        ).length === 1
                        ? "Event"
                        : "Events"}
                    </button>
                  </div>
                ) : null}
              </section>
              {roles.filter(role => role.get("name") === "Admin").length ? (
                <section className="fields">
                  <h1>Create an Event</h1>
                  <form onSubmit={this.createEvent}>
                    <div className="field field--half">
                      <label>
                        <span>Name</span>
                        <input
                          type="text"
                          value={eventName}
                          onChange={this.handleEventNameChange}
                          required
                        />
                      </label>
                    </div>
                    <div className="field field--half">
                      <label>
                        <span>Date</span>
                        <input
                          type="date"
                          max="2099-12-31"
                          value={eventDate}
                          onChange={this.handleEventDateChange}
                          required
                        />
                      </label>
                    </div>
                    <div className="field field--half">
                      <label>
                        <span>Location</span>
                        <input
                          type="text"
                          value={eventLocation}
                          onChange={this.handleEventLocationChange}
                          required
                        />
                      </label>
                    </div>
                    <div className="field">
                      <button type="submit" className="primary">
                        Create
                      </button>
                    </div>
                  </form>
                </section>
              ) : null}
              {AV.User.current() ? (
                <section className="fields">
                  <div className="field">
                    <button onClick={this.logOut}>
                      Log out ({AV.User.current().get("name")})
                    </button>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
