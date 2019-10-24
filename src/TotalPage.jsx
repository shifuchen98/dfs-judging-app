import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class TotalPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: new AV.Object('Event'),
      scores: []
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.fetchScores = this.fetchScores.bind(this);
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
    const { match } = this.props;
    const eventsQuery = new AV.Query('Event');
    eventsQuery
      .get(match.params.id)
      .then(event => {
        this.setState({ event }, this.fetchScores);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchScores() {
    const { match } = this.props;
    const eventTeamsQuery = new AV.Query('EventTeam');
    eventTeamsQuery
      .equalTo('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
      .find()
      .then(eventTeams => {
        eventTeams.forEach(eventTeam => {
          const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
          judgeTeamPairsQuery
            .equalTo('eventTeam', eventTeam)
            .include('eventJudge')
            .include('eventJudge.user')
            .find()
            .then(judgeTeamPairs => {
              this.setState({ scores: [...this.state.scores, { eventTeam, judgeTeamPairs }] });
            })
            .catch(error => {
              alert(error);
            });
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { event, scores } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            {scores.map(score =>
              <div className="card" key={score.eventTeam.id}>
                <section className="fields">
                  <h1>{score.eventTeam.get('name')}</h1>
                  <div className="field">
                    <table>
                      <thead>
                        <tr>
                          <th>Judge</th>
                          {event.get('criteria').map((criterion, index) =>
                            <th key={index}>{criterion.name} ({criterion.max})</th>
                          )}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {score.judgeTeamPairs.map(judgeTeamPair =>
                          <tr key={judgeTeamPair.get('eventJudge').id}>
                            <td>{judgeTeamPair.get('eventJudge').get('user').get('name')}</td>
                            {event.get('criteria').map((criterion, index) =>
                              <td key={index}>{judgeTeamPair.get('scores').reduce((accumulator, currentValue) => {
                                let result = accumulator;
                                if (currentValue.name === criterion.name) {
                                  result += currentValue.value;
                                }
                                return result;
                              }, null)}</td>
                            )}
                            <td>{judgeTeamPair.get('scores').reduce((accumulator, currentValue) => {
                              let result = accumulator;
                              event.get('criteria').forEach(criterion => {
                                if (currentValue.name === criterion.name) {
                                  result += currentValue.value;
                                }
                              });
                              return result;
                            }, null)}</td>
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
