import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class JudgesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      judges: [],
      judgesSearch: '',
      judgeEmail: ''
    };
    this.fetchJudges = this.fetchJudges.bind(this);
    this.handleJudgesSearchChange = this.handleJudgesSearchChange.bind(this);
    this.handleJudgeEmailChange = this.handleJudgeEmailChange.bind(this);
    this.addJudge = this.addJudge.bind(this);
    this.deleteJudge = this.deleteJudge.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchJudges();
    }
  }

  fetchJudges() {
    const { match } = this.props
    const judgesQuery = new AV.Query('Judge');
    judgesQuery
      .equalTo('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
      .include('user')
      .find()
      .then(judges => {
        this.setState({ judges });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleJudgesSearchChange(event) {
    this.setState({ judgesSearch: event.target.value });
  }

  handleJudgeEmailChange(event) {
    this.setState({ judgeEmail: event.target.value });
  }

  addJudge(e) {
    const { match } = this.props
    const { judgeEmail } = this.state;
    const usersQuery = new AV.Query('_User');
    usersQuery
      .equalTo('email', judgeEmail)
      .first()
      .then(user => {
        if (user) {
          const judge = new AV.Object('Judge');
          judge
            .set('user', user)
            .set('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
            .save()
            .then(() => {
              this.setState({ judgeEmail: '' }, this.fetchJudges);
            })
            .catch(error => {
              if (error.code === 137) {
                alert('This judge is already added to the current event.');
              } else {
                alert(error);
              }
            });
        } else {
          alert('No user with the given email found.');
        }
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  deleteJudge(judge) {
    judge
      .destroy()
      .then(this.fetchJudges)
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { judges, judgesSearch, judgeEmail } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Add Judge</h1>
                <form onSubmit={this.addJudge}>
                  <div className="field field--half">
                    <label>
                      <span>Judge Email</span>
                      <input type="text" value={judgeEmail} onChange={this.handleJudgeEmailChange} required />
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
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {judges.filter(judge => judgesSearch ? judge.get('user').get('name').toLowerCase().includes(judgesSearch) || judge.get('user').get('email').toLowerCase().includes(judgesSearch) : true).map((judge, index) =>
                        <tr key={judge.id}>
                          <td>{index + 1}</td>
                          <td>{judge.get('user').get('name')}</td>
                          <td>{judge.get('user').get('email')}</td>
                          <td><button onClick={() => { this.deleteJudge(judge) }}>Delete</button></td>
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
