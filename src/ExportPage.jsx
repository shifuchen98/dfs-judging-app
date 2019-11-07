import React from 'react';

import AV from 'leancloud-storage/live-query';

import './style.css';

export default class ExportPage extends React.Component {
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
      .limit(1000)
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
      .limit(1000)
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
      .limit(1000)
      .find()
      .then(judgeTeamPairs => {
        this.setState({ judgeTeamPairs });
      })
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
                <h1>Raw Data</h1>
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
                        {eventTeams.map(eventTeam => <td key={eventTeam.id}>{judgeTeamPairs.filter(judgeTeamPair => judgeTeamPair.get('eventJudge').id === eventJudge.id && judgeTeamPair.get('eventTeam').id === eventTeam.id).reduce((accumulator, judgeTeamPair) => [...accumulator, ...judgeTeamPair.get('scores')], []).reduce((accumulator, score) => accumulator + score.value, null)}</td>)}
                      </tr>)}
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button className="primary">Export as CSV</button>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Normalized Data</h1>
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
                        {eventTeams.map(eventTeam => <td key={eventTeam.id}>?</td>)}
                      </tr>)}
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button className="primary">Export as CSV</button>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Winner Data</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Place</th>
                        <th>Team</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Team 1</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Team 2</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Team 3</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button className="primary">Export as CSV</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
