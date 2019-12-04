import React from "react";
import { NavLink as RouteLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons";

import AV from "leancloud-storage/live-query";

import "../style.css";

export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      pages: [
        {
          name: "Event Info",
          path: "info"
        }
      ]
    };
    this.updatePages = this.updatePages.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push("/");
    } else {
      AV.User.current()
        .getRoles()
        .then(roles => {
          this.setState({ roles }, this.updatePages);
        });
    }
  }

  updatePages() {
    const { match } = this.props;
    const { roles, pages } = this.state;
    if (roles.filter(role => role.get("name") === "Admin").length) {
      this.setState({
        pages: [
          ...pages,
          {
            name: "Judges",
            path: "judges"
          },
          {
            name: "Teams",
            path: "teams"
          },
          {
            name: "Assign Teams",
            path: "assign"
          },
          {
            name: "Criteria",
            path: "criteria"
          },
          {
            name: "Due for Judging",
            path: "due"
          },
          {
            name: "Total Score",
            path: "total"
          },
          {
            name: "Export",
            path: "export"
          },
          {
            name: "Winner",
            path: "winner"
          },
          {
            name: "Presentation",
            path: "presentation"
          }
        ]
      });
    } else {
      const eventJudgesQuery = new AV.Query("EventJudge");
      eventJudgesQuery
        .equalTo("event", AV.Object.createWithoutData("Event", match.params.id))
        .equalTo("user", AV.User.current())
        .first()
        .then(eventJudge => {
          const judgeTeamPairsQuery = new AV.Query("JudgeTeamPair");
          judgeTeamPairsQuery
            .equalTo("eventJudge", eventJudge)
            .include("eventTeam")
            .limit(1000)
            .find()
            .then(judgeTeamPairs => {
              const presentationScoresQuery = new AV.Query("PresentationScore");
              presentationScoresQuery
                .equalTo("eventJudge", eventJudge)
                .doesNotExist("score")
                .count()
                .then(presentationScoresLeft => {
                  this.setState({
                    pages: [
                      ...pages,
                      ...judgeTeamPairs
                        .sort(
                          (a, b) =>
                            a.get("eventTeam").get("place") -
                            b.get("eventTeam").get("place")
                        )
                        .map(judgeTeamPair => ({
                          name: judgeTeamPair.get("eventTeam").get("name"),
                          path: `scoring/${judgeTeamPair.id}`,
                          judgingCompleted: judgeTeamPair.get("scores").length
                            ? true
                            : false
                        })),
                      {
                        name: "Presentation Scores",
                        path: "pscoring",
                        presentationScoresLeft
                      }
                    ]
                  });
                })
                .catch(error => {
                  alert(error);
                });
              presentationScoresQuery
                .subscribe()
                .then(liveQuery => {
                  liveQuery.on("enter", () => {
                    const { pages } = this.state;
                    this.setState({
                      pages: pages.map(page =>
                        page.path === "pscoring"
                          ? {
                              name: page.name,
                              path: page.path,
                              presentationScoresLeft:
                                page.presentationScoresLeft + 1
                            }
                          : page
                      )
                    });
                  });
                  liveQuery.on("leave", () => {
                    const { pages } = this.state;
                    this.setState({
                      pages: pages.map(page =>
                        page.path === "pscoring"
                          ? {
                              name: page.name,
                              path: page.path,
                              presentationScoresLeft:
                                page.presentationScoresLeft - 1
                            }
                          : page
                      )
                    });
                  });
                })
                .catch(error => {
                  alert(error);
                });
            })
            .catch(error => {
              alert(error);
            });
          judgeTeamPairsQuery
            .subscribe()
            .then(liveQuery => {
              liveQuery.on("update", judgeTeamPair => {
                const { pages } = this.state;
                this.setState({
                  pages: pages.map(page =>
                    page.path === `scoring/${judgeTeamPair.id}`
                      ? {
                          name: page.name,
                          path: page.path,
                          judgingCompleted: judgeTeamPair.get("scores").length
                            ? true
                            : false
                        }
                      : page
                  )
                });
              });
            })
            .catch(error => {
              alert(error);
            });
        });
    }
  }

  render() {
    const { match, sideNavOn, closeSideNav } = this.props;
    const { pages } = this.state;
    return (
      <nav className={sideNavOn ? "side-nav on" : "side-nav"}>
        <div id="side-nav__logo">
          <img src={require("../assets/logo.png")} alt="Dreams for Schools" />
        </div>
        <ul id="side-nav__pages">
          {pages.map(page => (
            <li key={page.path}>
              <RouteLink
                to={`/event/${match.params.id}/${page.path}`}
                onClick={closeSideNav}
              >
                <span>
                  <span>{page.name}</span>
                  {"judgingCompleted" in page ? (
                    <span
                      style={{ float: "right" }}
                      aria-label={
                        page.judgingCompleted ? "Scored." : "Not scored."
                      }
                    >
                      {page.judgingCompleted ? (
                        <FontAwesomeIcon icon={faCheckCircle} />
                      ) : (
                        <FontAwesomeIcon icon={faCircle} />
                      )}
                    </span>
                  ) : null}
                  {"presentationScoresLeft" in page ? (
                    <span
                      style={{ float: "right" }}
                      aria-label={
                        page.presentationScoresLeft === 0
                          ? "Completed."
                          : "Not completed."
                      }
                    >
                      {page.presentationScoresLeft === 0 ? (
                        <FontAwesomeIcon icon={faCheckCircle} />
                      ) : (
                        <FontAwesomeIcon icon={faCircle} />
                      )}
                    </span>
                  ) : null}
                </span>
              </RouteLink>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
