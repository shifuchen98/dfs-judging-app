import React from 'react';

import AV from 'leancloud-storage/live-query';

import './style.css';

export default class PresentationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "",
      eventTeams: []
    };
    this.fetchEventTeams = this.fetchEventTeams.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchEventTeams()

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

  handleChange(event) {
    this.setState({ current: event.target.value })
  }

  render() {
    const { eventTeams, current } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Select Rank or Team</h1>
                <select value={current} onChange={this.handleChange}>
                  <option value="">Rank</option>
                  {eventTeams.map(eventTeam => <option key={eventTeam.id} value={eventTeam.get("name")}>{eventTeam.get("name")}</option>)}
                </select>
                {current === ""
                  ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Rank#</th>
                          <th>Team Name</th>
                          <th>Team Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Team A</td>
                          <td>10</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Team B</td>
                          <td>9</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Team C</td>
                          <td>8</td>
                        </tr>
                      </tbody>
                    </table>
                  )
                  : (
                    <table>
                      <thead>
                        <tr>
                          <th>Judge</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Judge A</td>
                          <td>10</td>
                        </tr>
                        <tr>
                          <td>Judge B</td>
                          <td>10</td>
                        </tr>
                        <tr>
                          <td>Judge C</td>
                          <td>10</td>
                        </tr>
                      </tbody>
                    </table>
                  )
                }

              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
