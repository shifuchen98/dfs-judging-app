import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      eventTeam: AV.Object.createWithoutData('EventTeam', match.params.tid),
      teamName: '',
      school: '',
      appName: '',
      appDescription: ''
    };
    this.fetchEventTeam = this.fetchEventTeam.bind(this);
    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleAppNameChange = this.handleAppNameChange.bind(this);
    this.handleAppDescriptionChange = this.handleAppDescriptionChange.bind(this);
    this.updateEventTeam = this.updateEventTeam.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchEventTeam();
    }
  }

  fetchEventTeam() {
    const { eventTeam } = this.state;
    eventTeam
      .fetch()
      .then(eventTeam => {
        this.setState({ eventTeam, teamName: eventTeam.get('name'), school: eventTeam.get('school'), appName: eventTeam.get('appName'), appDescription: eventTeam.get('appDescription') });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleTeamNameChange(e) {
    this.setState({ teamName: e.target.value });
  }

  handleSchoolChange(e) {
    this.setState({ school: e.target.value });
  }

  handleAppNameChange(e) {
    this.setState({ appName: e.target.value });
  }

  handleAppDescriptionChange(e) {
    this.setState({ appDescription: e.target.value });
  }

  updateEventTeam(e) {
    const { history, match } = this.props;
    const { eventTeam, teamName, school, appName, appDescription } = this.state;
    eventTeam
      .set('name', teamName)
      .set('school', school)
      .set('appName', appName)
      .set('appDescription', appDescription)
      .save()
      .then(() => {
        alert('Team information updated.');
        history.push(`/event/${match.params.id}/teams`);
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

  render() {
    const { teamName, school, appName, appDescription } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Edit Team</h1>
                <form onSubmit={this.updateEventTeam}>
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
