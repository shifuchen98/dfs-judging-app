import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class ScoringPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      // eventTeam: AV.Object.createWithoutData('EventTeam', match.params.tid),
      judgeTeamPair: AV.Object.createWithoutData('JudgeTeamPair', match.params.tid),
      scores: []
    };
    this.fetchJudgeTeamPair = this.fetchJudgeTeamPair.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
    // this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    // this.handleSchoolChange = this.handleSchoolChange.bind(this);
    // this.handleAppNameChange = this.handleAppNameChange.bind(this);
    // this.handleAppDescriptionChange = this.handleAppDescriptionChange.bind(this);
    // this.updateEventTeam = this.updateEventTeam.bind(this);
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
    const { history,match } = this.props;
    const {tid} = match.params;
    const {judgeTeamPair} = this.state;
    
    if (judgeTeamPair.id != tid) {
      this.setState({judgeTeamPair: AV.Object.createWithoutData('JudgeTeamPair',tid),}, () => {if (!AV.User.current()) {
        history.push('/');
      } else {
        this.fetchJudgeTeamPair();
      }});
      
    }
  }

  fetchJudgeTeamPair() {
    const { judgeTeamPair } = this.state;
    const judgeTeamPairQuery = new AV.Query('JudgeTeamPair');
    judgeTeamPairQuery
    .include("eventTeam")
    .include("eventTeam.event")
    .get(judgeTeamPair.id)
      .then(judgeTeamPair => {
        this.setState({ judgeTeamPair, scores :judgeTeamPair.get("eventTeam").get("event").get("criteria").map( criterium => ({
          name: criterium.name, score: ""
        }))  }) })
      .catch(error => {
        alert(error);
      });
  }

  handleScoreChange(e, criteriaName) {
    const {scores} = this.state;
    console.log(e.target.value,criteriaName,scores);
    this.setState({scores: scores.map( (item) => ({name:item.name,
       score : item.name == criteriaName ? e.target.value : item.score }) ) })
  }

  render() {
    const { judgeTeamPair,scores} = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Team Name: {judgeTeamPair.get("eventTeam")?judgeTeamPair.get("eventTeam").get("name"):null}</h1>
                <p>App Name: {judgeTeamPair.get("eventTeam")?judgeTeamPair.get("eventTeam").get("appName"):null}</p>
                <p>App Description: {judgeTeamPair.get("eventTeam")?judgeTeamPair.get("eventTeam").get("appDescription"):null}</p>
                 <form onSubmit={this.updateEventTeam}>
                  {
                    judgeTeamPair.get("eventTeam")?judgeTeamPair.get("eventTeam").get("event").get("criteria").map(criteria => 
                  <div className="field">

                    <label>
                      <span>{criteria.name + "  (out of " + criteria.max + ")"}</span>
                      <input type="text" value={scores.filter(score => score.name == criteria.name)[0].score} onChange= {(e) => {this.handleScoreChange(e,criteria.name) } } required />
                    </label>
                    </div>):null}
                  <div className="field">
                    <button type="submit" className="primary">Save</button>
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
