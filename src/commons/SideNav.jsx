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
      const judgeTeamPairsQuery = new AV.Query("JudgeTeamPair");
      judgeTeamPairsQuery
        .include("eventTeam")
        .limit(1000)
        .find()
        .then(judgeTeamPairs => {
          this.setState({
            pages: [
              ...pages,
              ...judgeTeamPairs.map(judgeTeamPair => ({
                name: judgeTeamPair.get("eventTeam").get("name"),
                path: `scoring/${judgeTeamPair.id}`,
                judgeTeamPair
              })),
              {
                name: "Presentation Scores",
                path: "pscoring"
              }
            ]
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
                page.judgeTeamPair
                  ? {
                      name: page.name,
                      path: page.path,
                      judgeTeamPair:
                        judgeTeamPair.id === page.judgeTeamPair.id
                          ? judgeTeamPair
                          : page.judgeTeamPair
                    }
                  : page
              )
            });
          });
        })
        .catch(error => {
          alert(error);
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
                  {page.judgeTeamPair ? (
                    <span
                      style={{ float: "right" }}
                      aria-label={
                        page.judgeTeamPair.get("scores").length
                          ? "Scored."
                          : "Not scored."
                      }
                    >
                      {page.judgeTeamPair.get("scores").length ? (
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
