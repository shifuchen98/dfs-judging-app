import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class AssignPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventJudges: [],
      eventTeams: [],
      judgeTeamPairs: []
    };
    this.fetchEventJudges = this.fetchEventJudges.bind(this);
    this.fetchEventTeams = this.fetchEventTeams.bind(this);
    this.fetchJudgeTeamPairs = this.fetchJudgeTeamPairs.bind(this);
    this.assign = this.assign.bind(this);
    this.unassign = this.unassign.bind(this);
    this.clear = this.clear.bind(this);
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
      .find()
      .then(eventJudges => {
        this.setState({ eventJudges }, this.fetchEventTeams);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchEventTeams() {
    const { match } = this.props;
    const eventTeamsQuery = new AV.Query('EventTeam');
    eventTeamsQuery
      .equalTo('event', AV.Object.createWithoutData('Event', match.params.id))
      .find()
      .then(eventTeams => {
        this.setState({ eventTeams }, this.fetchJudgeTeamPairs);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchJudgeTeamPairs() {
    const { match } = this.props;
    const eventTeamsQuery = new AV.Query('EventTeam');
    eventTeamsQuery
      .equalTo('event', AV.Object.createWithoutData('Event', match.params.id))
    const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
    judgeTeamPairsQuery
      .matchesQuery('eventTeam', eventTeamsQuery)
      .find()
      .then(judgeTeamPairs => {
        this.setState({ judgeTeamPairs });
      })
      .catch(error => {
        alert(error);
      });
  }

  assign(eventJudge, eventTeam) {
    const judgeTeamPairACL = new AV.ACL();
    judgeTeamPairACL.setReadAccess(eventJudge.get('user'), true);
    judgeTeamPairACL.setWriteAccess(eventJudge.get('user'), true)
    judgeTeamPairACL.setRoleReadAccess(new AV.Role('Admin'), true);
    judgeTeamPairACL.setRoleWriteAccess(new AV.Role('Admin'), true);
    const judgeTeamPair = new AV.Object('JudgeTeamPair');
    judgeTeamPair.set('eventJudge', eventJudge)
      .set('eventTeam', eventTeam)
      .setACL(judgeTeamPairACL)
      .save()
      .then(this.fetchJudgeTeamPairs)
      .catch(error => {
        alert(error);
      });
  }

  unassign(judgeTeamPair) {
    judgeTeamPair
      .destroy()
      .then(this.fetchJudgeTeamPairs)
      .catch(error => {
        alert(error);
      });
  }

  clear() {
    const { judgeTeamPairs } = this.state;
    AV.Object
      .destroyAll(judgeTeamPairs)
      .then(this.fetchJudgeTeamPairs)
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { eventJudges, eventTeams, judgeTeamPairs } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Current Assignment</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Judge</th>
                        {eventTeams.map(eventTeam => <th key={eventTeam.id}>{eventTeam.get('name')}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {eventJudges.map(eventJudge => <tr key={eventJudge.id}>
                        <td>{eventJudge.get('user').get('name')}</td>
                        {eventTeams.map(eventTeam => <td key={eventTeam.id}>{judgeTeamPairs.filter(judgeTeamPair => judgeTeamPair.get('eventJudge').id === eventJudge.id && judgeTeamPair.get('eventTeam').id === eventTeam.id).length ? <button style={{ width: '42px' }} onClick={() => { this.unassign(judgeTeamPairs.filter(judgeTeamPair => judgeTeamPair.get('eventJudge').id === eventJudge.id && judgeTeamPair.get('eventTeam').id === eventTeam.id)[0]) }}><span role="img" aria-label={`${eventJudge.get('user').get('name')} is assigned to ${eventTeam.get('name')}. Click to unassign.`}>✅</span></button> : <button style={{ width: '42px' }} onClick={() => { this.assign(eventJudge, eventTeam) }}><span role="img" aria-label={`${eventJudge.get('user').get('name')} is not assigned to ${eventTeam.get('name')}. Click to assign.`}>⬜</span></button>}</td>)}
                      </tr>)}
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button onClick={this.clear}>Clear Assignment</button>
                </div>
              </section>
              <section className="fields">
                <h1>Auto Assign</h1>
                <div className="field field--half">
                  <label>
                    <span>Each Team Gets Judged</span>
                    <select required>
                      <option>1 Time</option>
                      <option>2 Times</option>
                      <option>3 Times</option>
                      <option>4 Times</option>
                      <option>5 Times</option>
                    </select>
                  </label>
                </div>
                <div className="field field--half">
                  <label>
                    <span>Each Judge Judges No More Than</span>
                    <select required>
                      <option>1 Team</option>
                      <option>2 Teams</option>
                      <option>3 Teams</option>
                      <option>4 Teams</option>
                      <option>5 Teams</option>
                    </select>
                  </label>
                </div>
                <div className="field">
                  <button className="primary">Perform Assignment</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
