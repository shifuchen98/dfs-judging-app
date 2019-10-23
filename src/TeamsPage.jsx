import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      teamName: '',
      school: '',
      appName: '',
      appDescription: '',
      teamsSearch: ''
    };
    this.fetchTeams = this.fetchTeams.bind(this);
    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleAppNameChange = this.handleAppNameChange.bind(this);
    this.handleAppDescriptionChange = this.handleAppDescriptionChange.bind(this);
    this.handleTeamsSearchChange = this.handleTeamsSearchChange.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
  }

  componentDidMount() {
    this.fetchTeams();
  }

  fetchTeams() {
    const { match } = this.props
    const teamsQuery = new AV.Query('Team');
    teamsQuery
      .equalTo('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
      .find()
      .then(teams => {
        this.setState({ teams });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleTeamNameChange(event) {
    this.setState({ teamName: event.target.value });
  }

  handleSchoolChange(event) {
    this.setState({ school: event.target.value });
  }

  handleAppNameChange(event) {
    this.setState({ appName: event.target.value });
  }

  handleAppDescriptionChange(event) {
    this.setState({ appDescription: event.target.value });
  }

  handleTeamsSearchChange(event) {
    this.setState({ teamsSearch: event.target.value });
  }

  createTeam(e) {
    const { match } = this.props
    const { teamName, school, appName, appDescription } = this.state;
    const team = new AV.Object('Team');
    team
      .set('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
      .set('name', teamName)
      .set('school', school)
      .set('appName', appName)
      .set('appDescription', appDescription)
      .save()
      .then(() => {
        this.setState({ teamName: '', school: '', appName: '', appDescription: '' }, this.fetchTeams);
      })
      .catch(error => {
        alert(error);
      })
    e.preventDefault();
  }

  deleteTeam(team) {
    team
      .destroy()
      .then(this.fetchTeams)
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { teams, teamName, school, appName, appDescription, teamsSearch } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>New Team</h1>
                <form onSubmit={this.createTeam}>
                  <div className="field field--half">
                    <label>
                      <span>Team Name</span>
                      <input type="text" value={teamName} onChange={this.handleTeamNameChange} required />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>School</span>
                      <input type="text" value={school} onChange={this.handleSchoolChange} required />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>App Name</span>
                      <input type="text" value={appName} onChange={this.handleAppNameChange} required />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>App Description</span>
                      <input type="text" value={appDescription} onChange={this.handleAppDescriptionChange} required />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">Create</button>
                  </div>
                </form>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Existing Teams</h1>
                <div className="field field--half">
                  <label>
                    <span>Search</span>
                    <input type="text" value={teamsSearch} onChange={this.handleTeamsSearchChange} />
                  </label>
                </div>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Team Name</th>
                        <th>App Name</th>
                        <th>School</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.filter(team => teamsSearch ? team.get('name').toLowerCase().includes(teamsSearch) || team.get('appName').toLowerCase().includes(teamsSearch) : true).map((team, index) =>
                        <tr key={team.id}>
                          <td>{index + 1}</td>
                          <td>{team.get('name')}</td>
                          <td>{team.get('appName')}</td>
                          <td>{team.get('school')}</td>
                          <td><button onClick={() => { this.deleteTeam(team) }}>Delete</button></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
