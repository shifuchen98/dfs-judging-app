import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class TotalPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: []
    };
    this.fetchScores = this.fetchScores.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchScores();
    }
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
    const { scores } = this.state;
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
                          <th>Design 1</th>
                          <th>Design 2</th>
                          <th>Functionality 1</th>
                          <th>Functionality 2</th>
                          <th>Theme 1</th>
                          <th>Theme 2</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {score.judgeTeamPairs.map(judgeTeamPair =>
                          <tr key={judgeTeamPair.get('eventJudge').id}>
                            <td>{judgeTeamPair.get('eventJudge').get('user').get('name')}</td>
                            <td>{judgeTeamPair.get('scores').dscore1}</td>
                            <td>{judgeTeamPair.get('scores').dscore2}</td>
                            <td>{judgeTeamPair.get('scores').fscore1}</td>
                            <td>{judgeTeamPair.get('scores').fscore2}</td>
                            <td>{judgeTeamPair.get('scores').tscore1}</td>
                            <td>{judgeTeamPair.get('scores').tscore2}</td>
                            <td>{judgeTeamPair.get('scores').dscore1 + judgeTeamPair.get('scores').dscore2 + judgeTeamPair.get('scores').fscore1 + judgeTeamPair.get('scores').fscore2 + judgeTeamPair.get('scores').tscore1 + judgeTeamPair.get('scores').tscore2}</td>
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
