import React from "react";

import AV from "leancloud-storage/live-query";

import "./style.css";

export default class PresentationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTeams: [],
      presentationScores: [],
      currentEventTeam: ""
    };
    this.fetchEventTeams = this.fetchEventTeams.bind(this);
    this.fetchPresentationScores = this.fetchPresentationScores.bind(this);
    this.handleCurrentEventTeamChange = this.handleCurrentEventTeamChange.bind(
      this
    );
    this.inputPresentationScore = this.inputPresentationScore.bind(this);
    this.correctData = this.correctData.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push("/");
    } else {
      this.fetchEventTeams();
    }
  }

  fetchEventTeams() {
    const { match } = this.props;
    const eventTeamsQuery = new AV.Query("EventTeam");
    eventTeamsQuery
      .equalTo("event", AV.Object.createWithoutData("Event", match.params.id))
      .ascending("place")
      .limit(1000)
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
    const eventTeamsQuery = new AV.Query("EventTeam");
    eventTeamsQuery.equalTo(
      "event",
      AV.Object.createWithoutData("Event", match.params.id)
    );
    const presentationScoresQuery = new AV.Query("PresentationScore");
    presentationScoresQuery
      .matchesQuery("eventTeam", eventTeamsQuery)
      .include("eventJudge")
      .include("eventJudge.user")
      .include("eventTeam")
      .limit(1000)
      .find()
      .then(presentationScores => {
        this.setState({
          presentationScores: presentationScores.sort((a, b) =>
            a
              .get("eventJudge")
              .get("user")
              .get("name") <
            b
              .get("eventJudge")
              .get("user")
              .get("name")
              ? -1
              : 1
          )
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleCurrentEventTeamChange(e) {
    this.setState({ currentEventTeam: e.target.value });
  }

  inputPresentationScore(presentationScore) {
    const newScore = window.prompt(
      `Enter the presentation score ${presentationScore
        .get("eventJudge")
        .get("user")
        .get("name")} is giving to ${presentationScore
        .get("eventTeam")
        .get("name")}:`
    );
    if (newScore !== null) {
      if (!(parseInt(newScore) >= 0 && parseInt(newScore) <= 10)) {
        alert("Invalid value.");
      } else {
        presentationScore
          .set("score", parseInt(newScore))
          .save()
          .then(() => {
            alert("Presentation score saved.");
            this.fetchPresentationScores();
          })
          .catch(error => {
            alert(error);
          });
      }
    }
  }

  correctData() {
    const { match } = this.props;
    AV.Cloud.rpc("correctPresentationScores", {
      event: AV.Object.createWithoutData("Event", match.params.id)
    })
      .then(() => {
        alert("Data correction request initiated.");
      })
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const { eventTeams, presentationScores, currentEventTeam } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Presentation Scores</h1>
                <div className="field field--half">
                  <select
                    value={currentEventTeam}
                    onChange={this.handleCurrentEventTeamChange}
                  >
                    <option value="">All Teams</option>
                    {eventTeams.map(eventTeam => (
                      <option key={eventTeam.id} value={eventTeam.id}>
                        {eventTeam.get("name")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  {currentEventTeam ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Judge</th>
                          <th>Score</th>
                          <th>Input</th>
                        </tr>
                      </thead>
                      <tbody>
                        {presentationScores
                          .filter(
                            presentationScore =>
                              presentationScore.get("eventTeam").id ===
                              currentEventTeam
                          )
                          .map(presentationScore => (
                            <tr key={presentationScore.id}>
                              <td>
                                {presentationScore
                                  .get("eventJudge")
                                  .get("user")
                                  .get("name")}
                              </td>
                              <td>{presentationScore.get("score")}</td>
                              <td>
                                {presentationScore.get("score") ===
                                undefined ? (
                                  <button
                                    onClick={() => {
                                      this.inputPresentationScore(
                                        presentationScore
                                      );
                                    }}
                                  >
                                    Input
                                  </button>
                                ) : null}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Place</th>
                          <th>Team Name</th>
                          <th>Total Score</th>
                          <th>Average Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventTeams
                          .map(eventTeam => {
                            const presentationScoresWithScores = presentationScores.filter(
                              presentationScore =>
                                presentationScore.get("eventTeam").id ===
                                  eventTeam.id &&
                                presentationScore.get("score") !== undefined
                            );
                            const totalScore = presentationScoresWithScores.reduce(
                              (accumulator, presentationScore) =>
                                accumulator + presentationScore.get("score"),
                              0
                            );
                            const averageScore = presentationScoresWithScores.length
                              ? totalScore / presentationScoresWithScores.length
                              : 0;
                            return {
                              eventTeam,
                              totalScore,
                              averageScore
                            };
                          })
                          .sort((a, b) => b.averageScore - a.averageScore)
                          .map((place, index) => (
                            <tr key={place.eventTeam.id}>
                              <td>{index + 1}</td>
                              <td>{place.eventTeam.get("name")}</td>
                              <td>{place.totalScore}</td>
                              <td>{place.averageScore.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Data Correction</h1>
                <p>
                  If a judge reports that they cannot find one or more teams
                  when giving presentation scores, click on the button below to
                  fix the issue.
                </p>
                <div className="field field--half">
                  <button onClick={this.correctData}>Perform Correction</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
