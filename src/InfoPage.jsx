import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      event: AV.Object.createWithoutData('Event', match.params.id),
      name: '',
      date: '',
      location: ''
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchEvent();
    }
  }

  fetchEvent() {
    const { event } = this.state;
    event
      .fetch()
      .then(event => {
        this.setState({ event, name: event.get('name'), date: event.get('date'), location: event.get('location') });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleDateChange(e) {
    this.setState({ date: e.target.value });
  }

  handleLocationChange(e) {
    this.setState({ location: e.target.value });
  }

  updateEvent(e) {
    const { event, name, date, location } = this.state;
    event
      .set('name', name)
      .set('date', date)
      .set('location', location)
      .save()
      .then(() => {
        alert('Event information updated.');
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  render() {
    const { name, date, location } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Edit Event</h1>
                <form onSubmit={this.updateEvent}>
                  <div className="field field--half">
                    <label>
                      <span>Name</span>
                      <input type="text" value={name} onChange={this.handleNameChange} required />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>Date</span>
                      <input type="text" value={date} onChange={this.handleDateChange} required />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>Location</span>
                      <input type="text" value={location} onChange={this.handleLocationChange} required />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">Save</button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
