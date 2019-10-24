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
    const teamsQuery = new AV.Query('Team');
    teamsQuery
      .equalTo('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
      .find()
      .then(teams => {
        teams.forEach(team => {
          const assignmentsQuery = new AV.Query('Assignment');
          assignmentsQuery
            .equalTo('team', team)
            .include('judge')
            .include('judge.user')
            .find()
            .then(assignments => {
              this.setState({ scores: [...this.state.scores, { team, assignments }] });
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
              <div className="card" key={score.team.id}>
                <section className="fields">
                  <h1>{score.team.get('name')}</h1>
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
                        {score.assignments.map(assignment =>
                          <tr key={assignment.get('judge').id}>
                            <td>{assignment.get('judge').get('user').get('name')}</td>
                            <td>{assignment.get('scores').dscore1}</td>
                            <td>{assignment.get('scores').dscore2}</td>
                            <td>{assignment.get('scores').fscore1}</td>
                            <td>{assignment.get('scores').fscore2}</td>
                            <td>{assignment.get('scores').tscore1}</td>
                            <td>{assignment.get('scores').tscore2}</td>
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
