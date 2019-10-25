import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class TotalPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      event: AV.Object.createWithoutData('Event', match.params.id),
      eventTeams: [],
      judgeTeamPairs: []
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.fetchEventTeams = this.fetchEventTeams.bind(this);
    this.fetchJudgeTeamPairs = this.fetchJudgeTeamPairs.bind(this);
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
        this.setState({ event }, this.fetchEventTeams);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchEventTeams() {
    const { event } = this.state;
    const eventTeamsQuery = new AV.Query('EventTeam');
    eventTeamsQuery
      .equalTo('event', event)
      .find()
      .then(eventTeams => {
        this.setState({ eventTeams }, this.fetchJudgeTeamPairs);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchJudgeTeamPairs() {
    const { event } = this.state;
    const eventTeamsQuery = new AV.Query('EventTeam');
    eventTeamsQuery
      .equalTo('event', event);
    const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
    judgeTeamPairsQuery
      .matchesQuery('eventTeam', eventTeamsQuery)
      .include('eventJudge')
      .include('eventJudge.user')
      .find()
      .then(judgeTeamPairs => {
        this.setState({ judgeTeamPairs });
      })
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { event, eventTeams, judgeTeamPairs } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            {eventTeams.map(eventTeam =>
              <div className="card" key={eventTeam.id}>
                <section className="fields">
                  <h1>{eventTeam.get('name')}</h1>
                  <div className="field">
                    <table>
                      <thead>
                        <tr>
                          <th>Judge</th>
                          {event.get('criteria').map(criterion =>
                            <th key={criterion.name}>{criterion.name} ({criterion.max})</th>
                          )}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {judgeTeamPairs.filter(judgeTeamPair => judgeTeamPair.get('eventTeam').id === eventTeam.id).map(judgeTeamPair =>
                          <tr key={judgeTeamPair.id}>
                            <td>{judgeTeamPair.get('eventJudge').get('user').get('name')}</td>
                            {event.get('criteria').map(criterion =>
                              <td key={criterion.name}>{judgeTeamPair.get('scores').reduce((accumulator, score) => score.name === criterion.name ? accumulator + score.value : accumulator, null)}</td>
                            )}
                            <td>{event.get('criteria').reduce((accumulator, criterion) => accumulator + judgeTeamPair.get('scores').reduce((accumulator, score) => score.name === criterion.name ? accumulator + score.value : accumulator, null), 0)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
