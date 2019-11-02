import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class ScoringPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      judgeTeamPair: AV.Object.createWithoutData('JudgeTeamPair', match.params.tid),
      scores: []
    };
    this.fetchJudgeTeamPair = this.fetchJudgeTeamPair.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
    this.submitScores = this.submitScores.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchJudgeTeamPair();
    }
  }

  componentDidUpdate() {
    const { history, match } = this.props;
    const { judgeTeamPair } = this.state;
    if (judgeTeamPair.id !== match.params.tid) {
      this.setState({ judgeTeamPair: AV.Object.createWithoutData('JudgeTeamPair', match.params.tid) }, () => {
        if (!AV.User.current()) {
          history.push('/');
        } else {
          this.fetchJudgeTeamPair();
        }
      });
    }
  }

  fetchJudgeTeamPair() {
    const { judgeTeamPair } = this.state;
    const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
    judgeTeamPairsQuery
      .include("eventTeam")
      .include("eventTeam.event")
      .get(judgeTeamPair.id)
      .then(judgeTeamPair => {
        this.setState({
          judgeTeamPair,
          scores: judgeTeamPair.get("eventTeam").get("event").get("criteria").map(criterion => ({
            name: criterion.name,
            value: judgeTeamPair.get('scores').filter(score => score.name === criterion.name).reduce((accumulator, score) => accumulator + score.value, '')
          }))
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleScoreChange(e, criterionName) {
    const { scores } = this.state;
    this.setState({
      scores: scores.map(score => ({
        name: score.name,
        value: score.name === criterionName ? e.target.value : score.value
      }))
    });
  }

  submitScores(e) {
    const { judgeTeamPair, scores } = this.state;
    judgeTeamPair
      .set('scores', scores.map(score => ({ name: score.name, value: parseInt(score.value) })))
      .save()
      .then(() => {
        alert('Scores submitted.');
        this.fetchJudgeTeamPair();
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  render() {
    const { judgeTeamPair, scores } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Team Name: {judgeTeamPair.get("eventTeam") ? judgeTeamPair.get("eventTeam").get("name") : null}</h1>
                <p>App Name: {judgeTeamPair.get("eventTeam") ? judgeTeamPair.get("eventTeam").get("appName") : null}</p>
                <p>App Description: {judgeTeamPair.get("eventTeam") ? judgeTeamPair.get("eventTeam").get("appDescription") : null}</p>
                <form onSubmit={this.submitScores}>
                  {(judgeTeamPair.get("eventTeam") ? judgeTeamPair.get("eventTeam").get("event").get("criteria") : []).map((criterion, index) =>
                    <div className="field" key={index}>
                      <label>
                        <span>{`${criterion.name} (out of ${criterion.max})`}</span>
                        <input type="number" min="0" max={criterion.max} step="1" value={scores.filter(score => score.name === criterion.name).reduce((accumulator, score) => accumulator + score.value, '')} onChange={e => { this.handleScoreChange(e, criterion.name); }} required disabled={judgeTeamPair.get('scores').length} />
                      </label>
                    </div>
                  )}
                  {(judgeTeamPair.get('scores') || []).length ? null :
                    <div className="field">
                      <button type="submit" className="primary">Submit</button>
                    </div>}
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
