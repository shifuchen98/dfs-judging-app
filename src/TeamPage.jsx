import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import AV from "leancloud-storage/live-query";

import "./style.css";

export default class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      eventTeam: AV.Object.createWithoutData("EventTeam", match.params.tid),
      teamName: "",
      school: "",
      schoolPrediction: "",
      appName: "",
      appDescription: "",
      place: ""
    };
    this.fetchEventTeam = this.fetchEventTeam.bind(this);
    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleSchoolCompletion = this.handleSchoolCompletion.bind(this);
    this.handleAppNameChange = this.handleAppNameChange.bind(this);
    this.handleAppDescriptionChange = this.handleAppDescriptionChange.bind(
      this
    );
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
    this.updateEventTeam = this.updateEventTeam.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push("/");
    } else {
      this.fetchEventTeam();
    }
  }

  fetchEventTeam() {
    const { eventTeam } = this.state;
    eventTeam
      .fetch()
      .then(eventTeam => {
        this.setState({
          eventTeam,
          teamName: eventTeam.get("name"),
          school: eventTeam.get("school"),
          appName: eventTeam.get("appName"),
          appDescription: eventTeam.get("appDescription"),
          place: eventTeam.get("place")
        });
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
        const eventTeamsQuery = new AV.Query("EventTeam");
        eventTeamsQuery
          .startsWith("school", school)
          .first()
          .then(eventTeam => {
            this.setState({
              schoolPrediction: eventTeam ? eventTeam.get("school") : ""
            });
          });
      } else {
        this.setState({ schoolPrediction: "" });
      }
    });
  }

  handleSchoolCompletion(e) {
    const { schoolPrediction } = this.state;
    if (e.keyCode === 40) {
      this.setState({ school: schoolPrediction });
    }
  }

  handleAppNameChange(e) {
    this.setState({ appName: e.target.value });
  }

  handleAppDescriptionChange(e) {
    this.setState({ appDescription: e.target.value });
  }

  handlePlaceChange(e) {
    this.setState({ place: e.target.value });
  }

  updateEventTeam(e) {
    const { history, match } = this.props;
    const {
      eventTeam,
      teamName,
      school,
      appName,
      appDescription,
      place
    } = this.state;
    eventTeam
      .set("name", teamName)
      .set("school", school)
      .set("appName", appName)
      .set("appDescription", appDescription)
      .set("place", parseInt(place))
      .save()
      .then(() => {
        alert("Team information updated.");
        history.push(`/event/${match.params.id}/teams`);
      })
      .catch(error => {
        if (error.code === 137) {
          alert("Team already exists.");
        } else {
          alert(error);
        }
      });
    e.preventDefault();
  }

  render() {
    const {
      teamName,
      school,
      schoolPrediction,
      appName,
      appDescription,
      place
    } = this.state;
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
                      <input
                        type="text"
                        value={teamName}
                        onChange={this.handleTeamNameChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="field field--half field--with--dropdown">
                    <label>
                      <span>School</span>
                      <input
                        type="text"
                        value={school}
                        onChange={this.handleSchoolChange}
                        onKeyDown={this.handleSchoolCompletion}
                        required
                      />
                      <div
                        className="dropdown"
                        style={{
                          display:
                            schoolPrediction && school !== schoolPrediction
                              ? null
                              : "none"
                        }}
                      >
                        <span style={{ float: "left" }}>
                          {schoolPrediction}
                        </span>
                        <span style={{ float: "right" }}>
                          <kbd style={{ fontSize: "6pt" }}>
                            <FontAwesomeIcon icon={faArrowDown} />
                          </kbd>
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>App Name</span>
                      <input
                        type="text"
                        value={appName}
                        onChange={this.handleAppNameChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>App Description</span>
                      <input
                        type="text"
                        value={appDescription}
                        onChange={this.handleAppDescriptionChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>Place</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={place}
                        onChange={this.handlePlaceChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">
                      Save
                    </button>
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
