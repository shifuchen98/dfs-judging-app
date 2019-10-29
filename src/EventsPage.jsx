import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      events: [],
      eventsSearch: '',
      eventName: '',
      eventDate: new Date().toLocaleDateString('en-US'),
      eventLocation: ''
    };
    this.fetchEvents = this.fetchEvents.bind(this);
    this.handleEventsSearchChange = this.handleEventsSearchChange.bind(this);
    this.handleEventNameChange = this.handleEventNameChange.bind(this);
    this.handleEventDateChange = this.handleEventDateChange.bind(this);
    this.handleEventLocationChange = this.handleEventLocationChange.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      AV.User.current().getRoles().then(roles => {
        this.setState({ roles }, this.fetchEvents);
      });
    }
  }

  fetchEvents() {
    const { roles } = this.state;
    if (roles.filter(role => role.get('name') === 'Admin').length) {
      const eventsQuery = new AV.Query('Event');
      eventsQuery
        .find()
        .then(events => {
          this.setState({ events });
        })
        .catch(error => {
          alert(error);
        });
    } else {
      const eventJudgesQuery = new AV.Query('EventJudge');
      eventJudgesQuery
        .equalTo('user', AV.User.current())
        .include('event')
        .find()
        .then(eventJudges => {
          this.setState({ events: eventJudges.map(eventJudge => eventJudge.get('event')) });
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

  createEvent(e) {
    const { eventName, eventDate, eventLocation } = this.state;
    const event = new AV.Object('Event');
    event
      .set('name', eventName)
      .set('date', eventDate)
      .set('location', eventLocation)
      .save()
      .then(() => {
        this.setState({ eventName: '', eventDate: new Date().toLocaleDateString('en-US'), eventLocation: '' }, this.fetchEvents);
      })
      .catch(error => {
        alert(error);
      })
    e.preventDefault();
  }

  deleteEvent(event) {
    event
      .destroy()
      .then(this.fetchEvents)
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
    const { history } = this.props;
    const { roles, events, eventsSearch, eventName, eventDate, eventLocation } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column column--thin">
            <div className="card card--center card--ghosted">
              <section className="fields">
                <div className="field">
                  <img id="auth__logo" src={require('./assets/logo.png')} alt="Dreams for Schools" />
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Select an Event</h1>
                <div className="field field--half">
                  <label>
                    <span>Search</span>
                    <input type="text" value={eventsSearch} onChange={this.handleEventsSearchChange} />
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
                        {roles.filter(role => role.get('name') === 'Admin').length ? <th>Delete</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {events.filter(event => eventsSearch ? event.get('name').toLowerCase().includes(eventsSearch.toLowerCase()) : true).map(event =>
                        <tr key={event.id}>
                          <td>{event.get('name')}</td>
                          <td>{event.get('date')}</td>
                          <td>{event.get('location')}</td>
                          <td><button className="primary" onClick={() => { history.push(`/event/${event.id}/info`) }}>Enter</button></td>
                          {roles.filter(role => role.get('name') === 'Admin').length ? <td><button onClick={() => { this.deleteEvent(event) }}>Delete</button></td> : null}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
              {roles.filter(role => role.get('name') === 'Admin').length ?
                <section className="fields">
                  <h1>Create an Event</h1>
                  <form onSubmit={this.createEvent}>
                    <div className="field field--half">
                      <label>
                        <span>Name</span>
                        <input type="text" value={eventName} onChange={this.handleEventNameChange} required />
                      </label>
                    </div>
                    <div className="field field--half">
                      <label>
                        <span>Date</span>
                        <input type="text" value={eventDate} onChange={this.handleEventDateChange} required />
                      </label>
                    </div>
                    <div className="field field--half">
                      <label>
                        <span>Location</span>
                        <input type="text" value={eventLocation} onChange={this.handleEventLocationChange} required />
                      </label>
                    </div>
                    <div className="field">
                      <button type="submit" className="primary">Create</button>
                    </div>
                  </form>
                </section> : null
              }
              <section className="fields">
                <div className="field">
                  <button onClick={this.logOut}>Log out ({AV.User.current().get('name')})</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
