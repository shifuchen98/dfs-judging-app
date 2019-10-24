import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTeams: [],
      teamName: '',
      school: '',
      appName: '',
      appDescription: '',
      teamsSearch: ''
    };
    this.fetchEventTeams = this.fetchEventTeams.bind(this);
    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleAppNameChange = this.handleAppNameChange.bind(this);
    this.handleAppDescriptionChange = this.handleAppDescriptionChange.bind(this);
    this.handleTeamsSearchChange = this.handleTeamsSearchChange.bind(this);
    this.createEventTeam = this.createEventTeam.bind(this);
    this.deleteEventTeam = this.deleteEventTeam.bind(this);
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
      .equalTo('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
      .find()
      .then(eventTeams => {
        this.setState({ eventTeams });
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

  createEventTeam(e) {
    const { match } = this.props;
    const { teamName, school, appName, appDescription } = this.state;
    const eventTeam = new AV.Object('EventTeam');
    eventTeam
      .set('event', { __type: 'Pointer', className: 'Event', objectId: match.params.id })
      .set('name', teamName)
      .set('school', school)
      .set('appName', appName)
      .set('appDescription', appDescription)
      .save()
      .then(() => {
        this.setState({ teamName: '', school: '', appName: '', appDescription: '' }, this.fetchEventTeams);
      })
      .catch(error => {
        alert(error);
      })
    e.preventDefault();
  }

  deleteEventTeam(eventTeam) {
    eventTeam
      .destroy()
      .then(this.fetchEventTeams)
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { eventTeams, teamName, school, appName, appDescription, teamsSearch } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>New Team</h1>
                <form onSubmit={this.createEventTeam}>
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
                      {eventTeams.filter(eventTeam => teamsSearch ? eventTeam.get('name').toLowerCase().includes(teamsSearch.toLowerCase()) || eventTeam.get('appName').toLowerCase().includes(teamsSearch.toLowerCase()) : true).map((eventTeam, index) =>
                        <tr key={eventTeam.id}>
                          <td>{index + 1}</td>
                          <td>{eventTeam.get('name')}</td>
                          <td>{eventTeam.get('appName')}</td>
                          <td>{eventTeam.get('school')}</td>
                          <td><button onClick={() => { this.deleteEventTeam(eventTeam) }}>Delete</button></td>
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
