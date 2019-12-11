import React from "react";

import AV from "leancloud-storage/live-query";
import Papa from "papaparse";

import "./style.css";

export default class ExportPage extends React.Component {
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
    this.rawData = this.rawData.bind(this);
    this.normalizedData = this.normalizedData.bind(this);
    this.winnerData = this.winnerData.bind(this);
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
        this.setState(
          {
            eventJudges: eventJudges.sort((a, b) =>
              a.get("user").get("name") < b.get("user").get("name") ? -1 : 1
            )
          },
          this.fetchEventTeams
        );
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
    eventTeamsQuery.equalTo("event", event).limit(1000);
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

  rawData() {
    const { event, eventJudges, eventTeams, judgeTeamPairs } = this.state;
    return Papa.unparse(
      [
        ["Judge", ...eventTeams.map(eventTeam => eventTeam.get("name"))],
        ...eventJudges.map(eventJudge => [
          eventJudge.get("user").get("name"),
          ...eventTeams.map(eventTeam =>
            judgeTeamPairs
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
                null
              )
          )
        ])
      ],
      { delimiter: "," }
    );
  }

  normalizedData() {
    const { eventJudges, eventTeams, judgeTeamPairs } = this.state;
    return Papa.unparse(
      [
        ["Judge", ...eventTeams.map(eventTeam => eventTeam.get("name"))],
        ...eventJudges.map(eventJudge => [
          eventJudge.get("user").get("name"),
          ...this.normalizedScores(eventJudge).map(score =>
            judgeTeamPairs.filter(
              judgeTeamPair =>
                judgeTeamPair.get("eventJudge").id === eventJudge.id &&
                judgeTeamPair.get("eventTeam").id === score.eventTeam.id
            ).length
              ? score.value.toFixed(2)
              : null
          )
        ]),
        ["Total", ...eventTeams.map(eventTeam => this.totalScore(eventTeam))]
      ],
      { delimiter: "," }
    );
  }

  winnerData() {
    const { eventTeams } = this.state;
    return Papa.unparse(
      [
        ["Place", "Team", "Score"],
        ...eventTeams
          .map(eventTeam => ({ eventTeam, value: this.totalScore(eventTeam) }))
          .sort((a, b) => b.value - a.value)
          .map((score, index) => [
            index + 1,
            score.eventTeam.get("name"),
            score.value
          ])
      ],
      { delimiter: "," }
    );
  }

  render() {
    const { event, eventJudges, eventTeams, judgeTeamPairs } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Raw Data</h1>
                <div className="field">
                  <table className="condensed">
                    <thead>
                      <tr>
                        <th>
                          <span>Judge</span>
                        </th>
                        {eventTeams.map(eventTeam => (
                          <th key={eventTeam.id}>
                            <span>{eventTeam.get("name")}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eventJudges.map(eventJudge => (
                        <tr key={eventJudge.id}>
                          <td>{eventJudge.get("user").get("name")}</td>
                          {eventTeams.map(eventTeam => (
                            <td key={eventTeam.id}>
                              {judgeTeamPairs
                                .filter(
                                  judgeTeamPair =>
                                    judgeTeamPair.get("eventJudge").id ===
                                      eventJudge.id &&
                                    judgeTeamPair.get("eventTeam").id ===
                                      eventTeam.id
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
                                  null
                                )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                      this.rawData()
                    )}`}
                    download={`${event.get("name")} (Raw Data).csv`}
                    tabIndex="-1"
                  >
                    <button className="primary">Export as CSV</button>
                  </a>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Normalized Data</h1>
                <div className="field">
                  <table className="condensed">
                    <thead>
                      <tr>
                        <th>
                          <span>Judge</span>
                        </th>
                        {eventTeams.map(eventTeam => (
                          <th key={eventTeam.id}>
                            <span>{eventTeam.get("name")}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eventJudges.map(eventJudge => (
                        <tr key={eventJudge.id}>
                          <td>{eventJudge.get("user").get("name")}</td>
                          {this.normalizedScores(eventJudge).map(score => (
                            <td key={score.eventTeam.id}>
                              {judgeTeamPairs.filter(
                                judgeTeamPair =>
                                  judgeTeamPair.get("eventJudge").id ===
                                    eventJudge.id &&
                                  judgeTeamPair.get("eventTeam").id ===
                                    score.eventTeam.id
                              ).length
                                ? score.value.toFixed(2)
                                : null}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td>Total</td>
                        {eventTeams.map(eventTeam => (
                          <td key={eventTeam.id}>
                            {this.totalScore(eventTeam)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                      this.normalizedData()
                    )}`}
                    download={`${event.get("name")} (Normalized Data).csv`}
                    tabIndex="-1"
                  >
                    <button className="primary">Export as CSV</button>
                  </a>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Winner Data</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Place</th>
                        <th>Team</th>
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
                            <td>{score.value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                      this.winnerData()
                    )}`}
                    download={`${event.get("name")} (Winner Data).csv`}
                    tabIndex="-1"
                  >
                    <button className="primary">Export as CSV</button>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
