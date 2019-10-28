import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class AssignPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventJudges: [],
      eventTeams: [],
      judgeTeamPairs: [],
      timesEachTeamGetsJudged: ''
    };
    this.fetchEventJudges = this.fetchEventJudges.bind(this);
    this.fetchEventTeams = this.fetchEventTeams.bind(this);
    this.fetchJudgeTeamPairs = this.fetchJudgeTeamPairs.bind(this);
    this.handleTimesEachTeamGetsJudgedChange = this.handleTimesEachTeamGetsJudgedChange.bind(this);
    this.assign = this.assign.bind(this);
    this.unassign = this.unassign.bind(this);
    this.clear = this.clear.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.autoAssign = this.autoAssign.bind(this);
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

  handleTimesEachTeamGetsJudgedChange(e) {
    this.setState({ timesEachTeamGetsJudged: e.target.value });
  }

  assign(eventJudge, eventTeam) {
    const judgeTeamPairACL = new AV.ACL();
    judgeTeamPairACL.setReadAccess(eventJudge.get('user'), true);
    judgeTeamPairACL.setWriteAccess(eventJudge.get('user'), true)
    judgeTeamPairACL.setRoleReadAccess(new AV.Role('Admin'), true);
    judgeTeamPairACL.setRoleWriteAccess(new AV.Role('Admin'), true);
    const judgeTeamPair = new AV.Object('JudgeTeamPair');
    judgeTeamPair
      .set('eventJudge', eventJudge)
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

  shuffle(array) {
    const result = array.map(array => array);
    let m = result.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = result[m];
      result[m] = result[i];
      result[i] = t;
    }
    return result;
  }

  autoAssign(e) {
    const { eventJudges, eventTeams, judgeTeamPairs, timesEachTeamGetsJudged } = this.state;
    const result = eventJudges.map(eventJudge => ({ eventJudge, eventTeams: [] }));
    const pendingTeams = this.shuffle(eventTeams.map(eventTeam => Array(parseInt(timesEachTeamGetsJudged)).fill(eventTeam)).flat());
    pendingTeams.forEach(pendingTeam => {
      const resultShadow = this.shuffle(result).filter(({ eventTeams }) => eventTeams.reduce((accumulator, eventTeam) => accumulator && eventTeam.id !== pendingTeam.id, true));
      resultShadow.sort((a, b) => a.eventTeams.length - b.eventTeams.length);
      for (let i = 0; i < resultShadow.length; i++) {
        let hasSchoolConflict = false;
        resultShadow[i].eventTeams.forEach(eventTeam => {
          if (eventTeam.get('school') === pendingTeam.get('school')) {
            hasSchoolConflict = true;
          }
        });
        if (!hasSchoolConflict) {
          resultShadow[i].eventTeams.push(pendingTeam);
          return;
        }
      }
      resultShadow[0].eventTeams.push(pendingTeam);
    });
    AV.Object
      .destroyAll(judgeTeamPairs)
      .then(() => {
        AV.Object
          .saveAll(result.reduce((accumulator, { eventJudge, eventTeams }) => {
            const judgeTeamPairs = eventTeams.map(eventTeam => {
              const judgeTeamPairACL = new AV.ACL();
              judgeTeamPairACL.setReadAccess(eventJudge.get('user'), true);
              judgeTeamPairACL.setWriteAccess(eventJudge.get('user'), true)
              judgeTeamPairACL.setRoleReadAccess(new AV.Role('Admin'), true);
              judgeTeamPairACL.setRoleWriteAccess(new AV.Role('Admin'), true);
              const judgeTeamPair = new AV.Object('JudgeTeamPair');
              return judgeTeamPair
                .set('eventJudge', eventJudge)
                .set('eventTeam', eventTeam)
                .setACL(judgeTeamPairACL)
            })
            return accumulator.concat(judgeTeamPairs);
          }, []))
          .then(this.fetchJudgeTeamPairs)
          .catch(error => {
            alert(error);
          });
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  render() {
    const { eventJudges, eventTeams, judgeTeamPairs, timesEachTeamGetsJudged } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Current Assignment</h1>
                <div className="field">
                  <table className="condensed">
                    <thead>
                      <tr>
                        <th><span>Judge</span></th>
                        {eventTeams.map(eventTeam => <th key={eventTeam.id}><span>{eventTeam.get('name')}</span></th>)}
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
                <form onSubmit={this.autoAssign}>
                  <div className="field field--half">
                    <label>
                      <span>Times Each Team Gets Judged</span>
                      <input type="number" value={timesEachTeamGetsJudged} min={0} max={eventJudges.length} step={1} onChange={this.handleTimesEachTeamGetsJudgedChange} required />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">Perform Assignment</button>
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
