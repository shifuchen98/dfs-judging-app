import React from 'react';

import AV from 'leancloud-storage/live-query';

import './style.css';

export default class DuePage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      event: AV.Object.createWithoutData('Event', match.params.id),
      judgingDueDate: '',
      judgingDueTime: ''
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.handleJudgingDueDateChange = this.handleJudgingDueDateChange.bind(this);
    this.handleJudgingDueTimeChange = this.handleJudgingDueTimeChange.bind(this);
    this.updateJudgingDuesAt = this.updateJudgingDuesAt.bind(this);
    this.clearJudgingDuesAt = this.clearJudgingDuesAt.bind(this);
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
        this.setState({ event, judgingDueDate: event.get('judgingDuesAt') ? `${event.get('judgingDuesAt').getFullYear()}-${`0${event.get('judgingDuesAt').getMonth() + 1}`.slice(-2)}-${`0${event.get('judgingDuesAt').getDate()}`.slice(-2)}` : `${event.get('date').getFullYear()}-${`0${event.get('date').getMonth() + 1}`.slice(-2)}-${`0${event.get('date').getDate()}`.slice(-2)}`, judgingDueTime: event.get('judgingDuesAt') ? `${`0${event.get('judgingDuesAt').getHours()}`.slice(-2)}:${`0${event.get('judgingDuesAt').getMinutes()}`.slice(-2)}` : '' });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleJudgingDueDateChange(e) {
    this.setState({ judgingDueDate: e.target.value });
  }

  handleJudgingDueTimeChange(e) {
    this.setState({ judgingDueTime: e.target.value });
  }

  updateJudgingDuesAt(e) {
    const { event, judgingDueDate, judgingDueTime } = this.state;
    event
      .set('judgingDuesAt', new Date(judgingDueDate.slice(0, 4), judgingDueDate.slice(5, 7) - 1, judgingDueDate.slice(8, 10), judgingDueTime.slice(0, 2), judgingDueTime.slice(3, 5), 0))
      .save()
      .then(() => {
        alert('Due successfully set.');
        this.fetchEvent();
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  clearJudgingDuesAt(e) {
    const { event } = this.state;
    event
      .unset('judgingDuesAt')
      .save()
      .then(() => {
        alert('Due successfully cleared.');
        this.fetchEvent();
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  render() {
    const { judgingDueDate, judgingDueTime } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Due for Judging</h1>
                <form onSubmit={this.updateJudgingDuesAt}>
                  <div className="field field--half">
                    <label>
                      <span>Date Judging Ends</span>
                      <input type="date" max="2099-12-31" value={judgingDueDate} onChange={this.handleJudgingDueDateChange} required />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>Time Judging Ends</span>
                      <input type="time" value={judgingDueTime} onChange={this.handleJudgingDueTimeChange} required />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">Save</button>
                  </div>
                  <div className="field">
                    <button type="button" onClick={this.clearJudgingDuesAt}>Clear</button>
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
