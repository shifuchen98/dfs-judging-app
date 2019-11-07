import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

import AV from 'leancloud-storage/live-query';

import './style.css';

export default class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTeams: [],
      teamName: '',
      school: '',
      schoolPrediction: '',
      appName: '',
      appDescription: '',
      teamsSearch: '',
      csvToBeImported: ''
    };
    this.fetchEventTeams = this.fetchEventTeams.bind(this);
    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleSchoolCompletion = this.handleSchoolCompletion.bind(this);
    this.handleAppNameChange = this.handleAppNameChange.bind(this);
    this.handleAppDescriptionChange = this.handleAppDescriptionChange.bind(this);
    this.handleTeamsSearchChange = this.handleTeamsSearchChange.bind(this);
    this.handleCsvToBeImportedChange = this.handleCsvToBeImportedChange.bind(this);
    this.createEventTeam = this.createEventTeam.bind(this);
    this.editEventTeam = this.editEventTeam.bind(this);
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
      .equalTo('event', AV.Object.createWithoutData('Event', match.params.id))
      .find()
      .then(eventTeams => {
        this.setState({ eventTeams });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleTeamNameChange(e) {
    this.setState({ teamName: e.target.value });
  }

  handleSchoolChange(e) {
    this.setState({ school: e.target.value }, () => {
      const { school } = this.state;
      if (school) {
        const eventTeamsQuery = new AV.Query('EventTeam');
        eventTeamsQuery
          .startsWith('school', school)
          .first()
          .then(eventTeam => {
            this.setState({ schoolPrediction: eventTeam ? eventTeam.get('school') : '' });
          });
      } else {
        this.setState({ schoolPrediction: '' });
      }
    });
  }

  handleSchoolCompletion(e) {
    const { schoolPrediction } = this.state;
    if (e.keyCode === 40) {
      this.setState({ school: schoolPrediction })
    }
  }

  handleAppNameChange(e) {
    this.setState({ appName: e.target.value });
  }

  handleAppDescriptionChange(e) {
    this.setState({ appDescription: e.target.value });
  }

  handleTeamsSearchChange(e) {
    this.setState({ teamsSearch: e.target.value });
  }

  handleCsvToBeImportedChange(e) {
    this.setState({ csvToBeImported: e.target.value });
  }

  createEventTeam(e) {
    const { match } = this.props;
    const { teamName, school, appName, appDescription } = this.state;
    const eventTeam = new AV.Object('EventTeam');
    eventTeam
      .set('event', AV.Object.createWithoutData('Event', match.params.id))
      .set('name', teamName)
      .set('school', school)
      .set('appName', appName)
      .set('appDescription', appDescription)
      .save()
      .then(() => {
        alert('Team successfully added.')
        this.setState({ teamName: '', school: '', appName: '', appDescription: '' }, this.fetchEventTeams);
      })
      .catch(error => {
        if (error.code === 137) {
          alert('Team already exists.');
        } else {
          alert(error);
        }
      });
    e.preventDefault();
  }

  editEventTeam(eventTeam) {
    const { history, match } = this.props;
    history.push(`/event/${match.params.id}/team/${eventTeam.id}`);
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
    const { eventTeams, teamName, school, schoolPrediction, appName, appDescription, teamsSearch, csvToBeImported } = this.state;
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
                  <div className="field field--half field--with--dropdown">
                    <label>
                      <span>School</span>
                      <input type="text" value={school} onChange={this.handleSchoolChange} onKeyDown={this.handleSchoolCompletion} required />
                      <div className="dropdown" style={{ display: schoolPrediction && school !== schoolPrediction ? null : 'none' }}>
                        <span style={{ float: 'left' }}>{schoolPrediction}</span>
                        <span style={{ float: 'right' }}><kbd style={{ fontSize: '6pt' }}><FontAwesomeIcon icon={faArrowDown} /></kbd></span>
                      </div>
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
                        <th>School</th>
                        <th>App Name</th>
                        <th>App Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventTeams.filter(eventTeam => teamsSearch ? eventTeam.get('name').toLowerCase().includes(teamsSearch.toLowerCase()) || eventTeam.get('appName').toLowerCase().includes(teamsSearch.toLowerCase()) : true).map((eventTeam, index) =>
                        <tr key={eventTeam.id}>
                          <td>{index + 1}</td>
                          <td>{eventTeam.get('name')}</td>
                          <td>{eventTeam.get('school')}</td>
                          <td>{eventTeam.get('appName')}</td>
                          <td>{eventTeam.get('appDescription')}</td>
                          <td><button onClick={() => { this.editEventTeam(eventTeam) }}>Edit</button></td>
                          <td><button onClick={() => { this.deleteEventTeam(eventTeam) }}>Delete</button></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Import Teams</h1>
                <div className="field">
                  <label>
                    <span>Paste CSV Here</span>
                    <textarea rows="20" value={csvToBeImported} onChange={this.handleCsvToBeImportedChange}></textarea>
                  </label>
                </div>
                <div className="field">
                  <button type="submit" className="primary">Import</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
