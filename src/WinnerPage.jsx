import React from "react";

import AV from "leancloud-storage/live-query";

import "./style.css";

export default class WinnerPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      event: AV.Object.createWithoutData("Event", match.params.id),
      eventJudges: [],
      eventTeams: [],
      judgeTeamPairs: []
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.fetchEventJudges = this.fetchEventJudges.bind(this);
    this.fetchEventTeams = this.fetchEventTeams.bind(this);
    this.fetchJudgeTeamPairs = this.fetchJudgeTeamPairs.bind(this);
    this.normalizedScores = this.normalizedScores.bind(this);
    this.totalScore = this.totalScore.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push("/");
    } else {
      this.fetchEvent();
    }
  }

  fetchEvent() {
    const { event } = this.state;
    event
      .fetch()
      .then(event => {
        this.setState({ event }, this.fetchEventJudges);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchEventJudges() {
    const { event } = this.state;
    const eventJudgesQuery = new AV.Query("EventJudge");
    eventJudgesQuery
      .equalTo("event", event)
      .include("user")
      .limit(1000)
      .find()
      .then(eventJudges => {
        this.setState({ eventJudges }, this.fetchEventTeams);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchEventTeams() {
    const { event } = this.state;
    const eventTeamsQuery = new AV.Query("EventTeam");
    eventTeamsQuery
      .equalTo("event", event)
      .addAscending("place")
      .addAscending("school")
      .addAscending("name")
      .limit(1000)
      .find()
      .then(eventTeams => {
        this.setState({ eventTeams }, this.fetchJudgeTeamPairs);
      })
      .catch(error => {
        alert(error);
      });
  }

  fetchJudgeTeamPairs() {
    const { event } = this.state;
    const eventTeamsQuery = new AV.Query("EventTeam");
    eventTeamsQuery.equalTo("event", event);
    const judgeTeamPairsQuery = new AV.Query("JudgeTeamPair");
    judgeTeamPairsQuery
      .matchesQuery("eventTeam", eventTeamsQuery)
      .limit(1000)
      .find()
      .then(judgeTeamPairs => {
        this.setState({ judgeTeamPairs });
      })
      .catch(error => {
        alert(error);
      });
  }

  normalizedScores(eventJudge) {
    const { event, eventTeams, judgeTeamPairs } = this.state;
    const judgeTeamPairsOfEventJudge = judgeTeamPairs.filter(
      judgeTeamPair => judgeTeamPair.get("eventJudge").id === eventJudge.id
    );
    let max = 0;
    let min = 0;
    if (judgeTeamPairsOfEventJudge.length) {
      max = event.get("criteria").reduce(
        (accumulator, criterion) =>
          accumulator +
          judgeTeamPairsOfEventJudge
            .sort(
              (a, b) =>
                event
                  .get("criteria")
                  .reduce(
                    (accumulator, criterion) =>
                      accumulator +
                      b
                        .get("scores")
                        .reduce(
                          (accumulator, score) =>
                            score.name === criterion.name
                              ? accumulator + score.value
                              : accumulator,
                          0
                        ),
                    0
                  ) -
                event
                  .get("criteria")
                  .reduce(
                    (accumulator, criterion) =>
                      accumulator +
                      a
                        .get("scores")
                        .reduce(
                          (accumulator, score) =>
                            score.name === criterion.name
                              ? accumulator + score.value
                              : accumulator,
                          0
                        ),
                    0
                  )
            )[0]
            .get("scores")
            .reduce(
              (accumulator, score) =>
                score.name === criterion.name
                  ? accumulator + score.value
                  : accumulator,
              0
            ),
        0
      );
      min = event.get("criteria").reduce(
        (accumulator, criterion) =>
          accumulator +
          judgeTeamPairsOfEventJudge
            .sort(
              (a, b) =>
                event
                  .get("criteria")
                  .reduce(
                    (accumulator, criterion) =>
                      accumulator +
                      a
                        .get("scores")
                        .reduce(
                          (accumulator, score) =>
                            score.name === criterion.name
                              ? accumulator + score.value
                              : accumulator,
                          0
                        ),
                    0
                  ) -
                event
                  .get("criteria")
                  .reduce(
                    (accumulator, criterion) =>
                      accumulator +
                      b
                        .get("scores")
                        .reduce(
                          (accumulator, score) =>
                            score.name === criterion.name
                              ? accumulator + score.value
                              : accumulator,
                          0
                        ),
                    0
                  )
            )[0]
            .get("scores")
            .reduce(
              (accumulator, score) =>
                score.name === criterion.name
                  ? accumulator + score.value
                  : accumulator,
              0
            ),
        0
      );
    }
    return eventTeams.map(eventTeam => ({
      eventTeam,
      value:
        ((judgeTeamPairs
          .filter(
            judgeTeamPair =>
              judgeTeamPair.get("eventJudge").id === eventJudge.id &&
              judgeTeamPair.get("eventTeam").id === eventTeam.id
          )
          .reduce(
            (accumulator, judgeTeamPair) =>
              accumulator +
              event
                .get("criteria")
                .reduce(
                  (accumulator, criterion) =>
                    accumulator +
                    judgeTeamPair
                      .get("scores")
                      .reduce(
                        (accumulator, score) =>
                          score.name === criterion.name
                            ? accumulator + score.value
                            : accumulator,
                        0
                      ),
                  0
                ),
            0
          ) -
          min) /
          (max - min)) *
          event
            .get("criteria")
            .reduce(
              (accumulator, criterion) => accumulator + criterion.max,
              0
            ) || 0
    }));
  }

  totalScore(eventTeam) {
    const { eventJudges, judgeTeamPairs } = this.state;
    return eventJudges
      .map(eventJudge =>
        this.normalizedScores(eventJudge)
          .filter(score => score.eventTeam.id === eventTeam.id)
          .map(score =>
            judgeTeamPairs.filter(
              judgeTeamPair =>
                judgeTeamPair.get("eventJudge").id === eventJudge.id &&
                judgeTeamPair.get("eventTeam").id === score.eventTeam.id
            ).length
              ? score.value
              : 0
          )
          .reduce((accumulator, value) => accumulator + value, 0)
      )
      .reduce((accumulator, value) => accumulator + value, 0)
      .toFixed(2);
  }

  render() {
    const { eventTeams } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Results</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Place</th>
                        <th>Team</th>
                        <th>School</th>
                        <th>App Name</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventTeams
                        .map(eventTeam => ({
                          eventTeam,
                          value: this.totalScore(eventTeam)
                        }))
                        .sort((a, b) => b.value - a.value)
                        .map((score, index) => (
                          <tr key={score.eventTeam.id}>
                            <td>{index + 1}</td>
                            <td>{score.eventTeam.get("name")}</td>
                            <td>{score.eventTeam.get("school")}</td>
                            <td>{score.eventTeam.get("appName")}</td>
                            <td>{score.value}</td>
                          </tr>
                        ))}
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
