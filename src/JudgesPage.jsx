import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import AV from "leancloud-storage/live-query";
import Papa from "papaparse";
import xlsxParser from "xlsx-parse-json";
import "./style.css";

export default class JudgesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventJudges: [],
      judgesSearch: "",
      judgeEmail: "",
      judgeEmailPrediction: "",
      textToBeImported: "",
      fileToBeImported: {}
    };
    this.fetchEventJudges = this.fetchEventJudges.bind(this);
    this.handleJudgesSearchChange = this.handleJudgesSearchChange.bind(this);
    this.handleJudgeEmailChange = this.handleJudgeEmailChange.bind(this);
    this.handleJudgeEmailCompletion = this.handleJudgeEmailCompletion.bind(
      this
    );
    this.handleTextToBeImportedChange = this.handleTextToBeImportedChange.bind(
      this
    );
    this.addEventJudge = this.addEventJudge.bind(this);
    this.editEventJudge = this.editEventJudge.bind(this);
    this.deleteEventJudge = this.deleteEventJudge.bind(this);
    this.handleFileUploadChange = this.handleFileUploadChange.bind(this);
    this.importFromFile = this.importFromFile.bind(this);
    this.importCsvFile = this.importCsvFile.bind(this);
    this.importXlsxFile = this.importXlsxFile.bind(this);
    this.importFromText = this.importFromText.bind(this);
    this.importFromJson = this.importFromJson.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push("/");
    } else {
      this.fetchEventJudges();
    }
  }

  fetchEventJudges() {
    const { match } = this.props;
    const eventJudgesQuery = new AV.Query("EventJudge");
    eventJudgesQuery
      .equalTo("event", AV.Object.createWithoutData("Event", match.params.id))
      .include("user")
      .include("user.judgePassword")
      .limit(1000)
      .find()
      .then(eventJudges => {
        this.setState({
          eventJudges: eventJudges.sort((a, b) =>
            a.get("user").get("name") < b.get("user").get("name") ? -1 : 1
          )
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleJudgesSearchChange(e) {
    this.setState({ judgesSearch: e.target.value });
  }

  handleJudgeEmailChange(e) {
    this.setState({ judgeEmail: e.target.value }, () => {
      const { judgeEmail } = this.state;
      if (judgeEmail) {
        const usersQuery = new AV.Query("_User");
        usersQuery
          .startsWith("email", judgeEmail)
          .exists("judgePassword")
          .first()
          .then(user => {
            this.setState({
              judgeEmailPrediction: user ? user.get("email") : ""
            });
          });
      } else {
        this.setState({ judgeEmailPrediction: "" });
      }
    });
  }

  handleJudgeEmailCompletion(e) {
    const { judgeEmailPrediction } = this.state;
    if (e.keyCode === 40) {
      this.setState({ judgeEmail: judgeEmailPrediction });
    }
  }

  handleTextToBeImportedChange(e) {
    this.setState({ textToBeImported: e.target.value });
  }

  addEventJudge(e) {
    const { match } = this.props;
    const { judgeEmail } = this.state;
    const usersQuery = new AV.Query("_User");
    usersQuery
      .equalTo("email", judgeEmail)
      .first()
      .then(user => {
        if (user) {
          user
            .getRoles()
            .then(roles => {
              if (roles.filter(role => role.get("name") === "Admin").length) {
                alert("An admin cannot be added as a judge.");
              } else {
                const eventJudge = new AV.Object("EventJudge");
                eventJudge
                  .set("user", user)
                  .set(
                    "event",
                    AV.Object.createWithoutData("Event", match.params.id)
                  )
                  .save()
                  .then(() => {
                    alert("Judge successfully added");
                    this.setState({ judgeEmail: "" }, this.fetchEventJudges);
                  })
                  .catch(error => {
                    if (error.code === 137) {
                      alert(
                        "This judge is already added to the current event."
                      );
                    } else {
                      alert(error);
                    }
                  });
              }
            })
            .catch(error => {
              alert(error);
            });
        } else {
          const judgeName = prompt(
            "This is the first time this judge attends DFS. Please provide the name of the judge."
          );
          if (judgeName !== null) {
            const password = `${parseInt(Math.random() * 10)}${parseInt(
              Math.random() * 10
            )}${parseInt(Math.random() * 10)}${parseInt(Math.random() * 10)}`;
            const judgePassword = new AV.Object("JudgePassword");
            judgePassword.set("password", password);
            const user = new AV.Object("_User");
            user
              .set("email", judgeEmail)
              .set("username", judgeEmail)
              .set("name", judgeName)
              .set("password", password)
              .set("judgePassword", judgePassword);
            const eventJudge = new AV.Object("EventJudge");
            eventJudge
              .set("user", user)
              .set(
                "event",
                AV.Object.createWithoutData("Event", match.params.id)
              )
              .save()
              .then(() => {
                alert("Judge successfully added");
                this.setState({ judgeEmail: "" }, this.fetchEventJudges);
              })
              .catch(error => {
                alert(error);
              });
          }
        }
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  editEventJudge(eventJudge) {
    const { history, match } = this.props;
    history.push(
      `/event/${match.params.id}/judge/${eventJudge.get("user").id}`
    );
  }

  deleteEventJudge(eventJudge) {
    if (
      window.confirm(
        `Are you sure to delete ${eventJudge
          .get("user")
          .get("name")} (${eventJudge.get("user").get("email")})?`
      )
    ) {
      eventJudge
        .destroy()
        .then(this.fetchEventJudges)
        .catch(error => {
          alert(error);
        });
    }
  }

  handleFileUploadChange(e) {
    if (e.target.files[0]) {
      this.setState({ fileToBeImported: e.target.files[0] });
    }
  }

  importFromFile(e) {
    const { fileToBeImported } = this.state;
    if (fileToBeImported.type === "text/csv") {
      this.importCsvFile();
    } else if (
      fileToBeImported.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      this.importXlsxFile();
    } else {
      alert("File must be of type .xlsx or .csv!");
    }
    e.preventDefault();
  }

  importCsvFile() {
    const { fileToBeImported } = this.state;
    Papa.parse(fileToBeImported, {
      complete: results => {
        this.importFromJson(results.data);
      },
      header: true
    });
  }

  importXlsxFile() {
    const { fileToBeImported } = this.state;
    xlsxParser.onFileSelection(fileToBeImported).then(data => {
      Object.keys(data).map(sheet => this.importFromJson(data[sheet]));
    });
  }

  importFromText(e) {
    let { textToBeImported } = this.state;
    textToBeImported = textToBeImported.trim();
    if (!textToBeImported.startsWith("email,name\n")) {
      textToBeImported = `email,name\n${textToBeImported}`;
    }
    Papa.parse(textToBeImported, {
      complete: results => {
        this.importFromJson(results.data);
      },
      header: true
    });
    e.preventDefault();
  }

  importFromJson(jsonToBeImported) {
    const { match } = this.props;
    const addEventJudge = async row => {
      try {
        const usersQuery = new AV.Query("_User");
        usersQuery.equalTo("email", row.email.trim());
        const user = await usersQuery.first();
        if (user) {
          const roles = await user.getRoles();
          if (roles.filter(role => role.get("name") === "Admin").length) {
            alert("An admin is skipped since it cannot be added as a judge.");
          } else {
            const eventJudge = new AV.Object("EventJudge");
            return eventJudge
              .set("user", user)
              .set(
                "event",
                AV.Object.createWithoutData("Event", match.params.id)
              );
          }
        } else {
          const password = `${parseInt(Math.random() * 10)}${parseInt(
            Math.random() * 10
          )}${parseInt(Math.random() * 10)}${parseInt(Math.random() * 10)}`;
          const judgePassword = new AV.Object("JudgePassword");
          judgePassword.set("password", password);
          const user = new AV.Object("_User");
          user
            .set("email", row.email.trim())
            .set("username", row.email.trim())
            .set("name", row.name.trim())
            .set("password", password)
            .set("judgePassword", judgePassword);
          const eventJudge = new AV.Object("EventJudge");
          return eventJudge
            .set("user", user)
            .set(
              "event",
              AV.Object.createWithoutData("Event", match.params.id)
            );
        }
      } catch (error) {
        if (error.code === 429) {
          return await addEventJudge(row);
        } else {
          throw error;
        }
      }
    };
    Promise.all(jsonToBeImported.map(addEventJudge))
      .then(eventJudges => {
        AV.Object.saveAll(eventJudges)
          .then(() => {
            alert("Judges successfully imported.");
            this.setState({ textToBeImported: "" }, this.fetchEventJudges);
          })
          .catch(error => {
            if (error.code === 137) {
              alert(
                "Judges successfully imported with existing judges skipped."
              );
              this.setState({ textImportImport: "" }, this.fetchEventJudges);
            } else {
              alert(error);
            }
          });
      })
      .catch(error => {
        alert(error);
      });
  }

  render() {
    const {
      eventJudges,
      judgesSearch,
      judgeEmail,
      judgeEmailPrediction,
      textToBeImported
    } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Add Judge</h1>
                <form onSubmit={this.addEventJudge}>
                  <div className="field field--half field--with--dropdown">
                    <label>
                      <span>Judge Email</span>
                      <input
                        type="email"
                        value={judgeEmail}
                        onChange={this.handleJudgeEmailChange}
                        onKeyDown={this.handleJudgeEmailCompletion}
                        required
                      />
                      <div
                        className="dropdown"
                        style={{
                          display:
                            judgeEmailPrediction &&
                            judgeEmail !== judgeEmailPrediction
                              ? null
                              : "none"
                        }}
                      >
                        <span style={{ float: "left" }}>
                          {judgeEmailPrediction}
                        </span>
                        <span style={{ float: "right" }}>
                          <kbd style={{ fontSize: "6pt" }}>
                            <FontAwesomeIcon icon={faArrowDown} />
                          </kbd>
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">
                      Add
                    </button>
                  </div>
                </form>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Existing Judges ({eventJudges.length})</h1>
                <div className="field field--half">
                  <label>
                    <span>Search</span>
                    <input
                      type="text"
                      value={judgesSearch}
                      onChange={this.handleJudgesSearchChange}
                    />
                  </label>
                </div>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Password</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventJudges
                        .filter(eventJudge =>
                          judgesSearch
                            ? eventJudge
                                .get("user")
                                .get("name")
                                .toLowerCase()
                                .includes(judgesSearch.toLowerCase()) ||
                              eventJudge
                                .get("user")
                                .get("email")
                                .toLowerCase()
                                .includes(judgesSearch.toLowerCase())
                            : true
                        )
                        .map(eventJudge => (
                          <tr key={eventJudge.id}>
                            <td>{eventJudge.get("user").get("email")}</td>
                            <td>{eventJudge.get("user").get("name")}</td>
                            <td>
                              {eventJudge
                                .get("user")
                                .get("judgePassword")
                                .get("password")}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  this.editEventJudge(eventJudge);
                                }}
                              >
                                Edit
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  this.deleteEventJudge(eventJudge);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Import Judges</h1>
                <form onSubmit={this.importFromText}>
                  <div className="field">
                    <label>
                      <span>Paste CSV or TSV Here</span>
                      <textarea
                        rows="20"
                        placeholder={
                          "email,name\nthornton@uci.edu,Alex Thornton\npattis@uci.edu,Richard Pattis\n…"
                        }
                        value={textToBeImported}
                        onChange={this.handleTextToBeImportedChange}
                        required
                      ></textarea>
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">
                      Import
                    </button>
                  </div>
                </form>
                <form onSubmit={this.importFromFile}>
                  <div className="field">
                    <label>
                      <span>Upload XLSX or CSV file Here</span>
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={this.handleFileUploadChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">
                      Upload
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
