import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      this.fetchEvents();
    }
  }

  fetchEvents() {
    const eventsQuery = new AV.Query('Event');
    eventsQuery
      .find()
      .then(events => {
        this.setState({ events });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleEventsSearchChange(event) {
    this.setState({ eventsSearch: event.target.value });
  }

  handleEventNameChange(event) {
    this.setState({ eventName: event.target.value });
  }

  handleEventDateChange(event) {
    this.setState({ eventDate: event.target.value });
  }

  handleEventLocationChange(event) {
    this.setState({ eventLocation: event.target.value });
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
    const { events, eventsSearch, eventName, eventDate, eventLocation } = this.state;
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
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.filter(event => eventsSearch ? event.get('name').toLowerCase().includes(eventsSearch.toLowerCase()) : true).map(event =>
                        <tr key={event.id}>
                          <td>{event.get('name')}</td>
                          <td>{event.get('date')}</td>
                          <td>{event.get('location')}</td>
                          <td><button className="primary" onClick={() => { history.push(`/event/${event.id}/judges`) }}>Enter</button></td>
                          <td><button onClick={() => { this.deleteEvent(event) }}>Delete</button></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
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
              </section>
              <section className="fields">
                <div className="field">
                  <button onClick={this.logOut}>Log out</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
