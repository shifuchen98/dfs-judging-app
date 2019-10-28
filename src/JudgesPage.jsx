import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class JudgesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventJudges: [],
      judgesSearch: '',
      judgeEmail: ''
    };
    this.fetchEventJudges = this.fetchEventJudges.bind(this);
    this.handleJudgesSearchChange = this.handleJudgesSearchChange.bind(this);
    this.handleJudgeEmailChange = this.handleJudgeEmailChange.bind(this);
    this.addEventJudge = this.addEventJudge.bind(this);
    this.deleteEventJudge = this.deleteEventJudge.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchEventJudges();
    }
  }

  fetchEventJudges() {
    const { match } = this.props;
    const eventJudgesQuery = new AV.Query('EventJudge');
    eventJudgesQuery
      .equalTo('event', AV.Object.createWithoutData('Event', match.params.id))
      .include('user')
      .include('user.judgePassword')
      .find()
      .then(eventJudges => {
        this.setState({ eventJudges });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleJudgesSearchChange(e) {
    this.setState({ judgesSearch: e.target.value });
  }

  handleJudgeEmailChange(e) {
    this.setState({ judgeEmail: e.target.value });
  }

  addEventJudge(e) {
    const { match } = this.props;
    const { judgeEmail } = this.state;
    const usersQuery = new AV.Query('_User');
    usersQuery
      .equalTo('email', judgeEmail)
      .first()
      .then(user => {
        if (user) {
          const eventJudge = new AV.Object('EventJudge');
          eventJudge
            .set('user', user)
            .set('event', AV.Object.createWithoutData('Event', match.params.id))
            .save()
            .then(() => {
              alert('Judge successfully added');
              this.setState({ judgeEmail: '' }, this.fetchEventJudges);
            })
            .catch(error => {
              if (error.code === 137) {
                alert('This judge is already added to the current event.');
              } else {
                alert(error);
              }
            });
        } else {
          const judgeName = prompt('This is the first time this judge attends DFS. Please provide the name of the judge.');
          if (judgeName !== null) {
            const password = `${parseInt(Math.random() * 10)}${parseInt(Math.random() * 10)}${parseInt(Math.random() * 10)}${parseInt(Math.random() * 10)}`
            const judgePassword = new AV.Object('JudgePassword')
            judgePassword
              .set('password', password);
            const user = new AV.Object('_User');
            user
              .set('email', judgeEmail)
              .set('username', judgeEmail)
              .set('name', judgeName)
              .set('password', password)
              .set('judgePassword', judgePassword);
            const eventJudge = new AV.Object('EventJudge');
            eventJudge
              .set('user', user)
              .set('event', AV.Object.createWithoutData('Event', match.params.id));
            AV.Object
              .saveAll([user, eventJudge])
              .then(() => {
                alert('Judge successfully added');
                this.setState({ judgeEmail: '' }, this.fetchEventJudges);
              })
              .catch(error => {
                alert(error);
              });
          }
        }
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  deleteEventJudge(eventJudge) {
    eventJudge
      .destroy()
      .then(this.fetchEventJudges)
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { eventJudges, judgesSearch, judgeEmail } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Add Judge</h1>
                <form onSubmit={this.addEventJudge}>
                  <div className="field field--half">
                    <label>
                      <span>Judge Email</span>
                      <input type="email" value={judgeEmail} onChange={this.handleJudgeEmailChange} required />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">Add</button>
                  </div>
                </form>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Existing Judge Accounts</h1>
                <div className="field field--half">
                  <label>
                    <span>Search</span>
                    <input type="text" value={judgesSearch} onChange={this.handleJudgesSearchChange} />
                  </label>
                </div>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventJudges.filter(eventJudge => judgesSearch ? eventJudge.get('user').get('name').toLowerCase().includes(judgesSearch.toLowerCase()) || eventJudge.get('user').get('email').toLowerCase().includes(judgesSearch.toLowerCase()) : true).map((eventJudge, index) =>
                        <tr key={eventJudge.id}>
                          <td>{index + 1}</td>
                          <td>{eventJudge.get('user').get('name')}</td>
                          <td>{eventJudge.get('user').get('email')}</td>
                          <td>{eventJudge.get('user').get('judgePassword') ? eventJudge.get('user').get('judgePassword').get('password') : null}</td>
                          <td><button onClick={() => { this.deleteEventJudge(eventJudge) }}>Delete</button></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
