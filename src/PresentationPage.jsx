import React from 'react';

import AV from 'leancloud-storage/live-query';

import './style.css';

export default class PresentationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTeams: [],
      presentationScores: [],
      currentEventTeam: '',
    };
    this.fetchEventTeams = this.fetchEventTeams.bind(this)
    this.fetchPresentationScores = this.fetchPresentationScores.bind(this)
    this.handleCurrentEventTeamChange = this.handleCurrentEventTeamChange.bind(this)
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchEventTeams();
    }
  }

  fetchEventTeams() {
    const { match } = this.props;
    const eventTeamsQuery = new AV.Query('EventTeam');
    eventTeamsQuery
      .equalTo('event', AV.Object.createWithoutData('Event', match.params.id))
      .find()
      .then(eventTeams => {
        this.setState({ eventTeams }, this.fetchPresentationScores);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchPresentationScores() {
    const { match } = this.props;
    const eventTeamsQuery = new AV.Query('EventTeam');
    eventTeamsQuery
      .equalTo('event', AV.Object.createWithoutData('Event', match.params.id));
    const presentationScoresQuery = new AV.Query('PresentationScore');
    presentationScoresQuery
      .matchesQuery('eventTeam', eventTeamsQuery)
      .include('eventJudge')
      .include('eventJudge.user')
      .find()
      .then(presentationScores => {
        this.setState({ presentationScores });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleCurrentEventTeamChange(e) {
    this.setState({ currentEventTeam: e.target.value })
  }

  render() {
    const { eventTeams, presentationScores, currentEventTeam } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Select Rank or Team</h1>
                <div className="field field--half">
                  <select value={currentEventTeam} onChange={this.handleCurrentEventTeamChange}>
                    <option value="">Rank</option>
                    {eventTeams.map(eventTeam => <option key={eventTeam.id} value={eventTeam.id}>{eventTeam.get("name")}</option>)}
                  </select>
                </div>
                <div className="field">
                  {currentEventTeam ?
                    <table>
                      <thead>
                        <tr>
                          <th>Judge</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {presentationScores.filter(presentationScore => presentationScore.get('eventTeam').id === currentEventTeam).map(presentationScore =>
                          <tr key={presentationScore.id}>
                            <td>{presentationScore.get('eventJudge').get('user').get('name')}</td>
                            <td>{presentationScore.get('score')}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    :
                    <table>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Team Name</th>
                          <th>Total Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventTeams
                          .map(eventTeam => ({
                            eventTeam,
                            score: presentationScores
                              .filter(presentationScore => presentationScore.get('eventTeam').id === eventTeam.id)
                              .reduce((accumulator, presentationScore) => accumulator + presentationScore.get('score') || 0, 0)
                          }))
                          .sort((a, b) => b.score - a.score)
                          .map((rank, index) =>
                            <tr key={rank.eventTeam.id}>
                              <td>{index + 1}</td>
                              <td>{rank.eventTeam.get('name')}</td>
                              <td>{rank.score}</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  }
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
