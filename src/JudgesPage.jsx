import React from "react";
import firebase from "./Auth.js";
import "./style.css";

export default class JudgesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      judges: []
    };
    this.db = firebase.firestore();
  }

  componentDidMount() {
    const judges = [];
    this.db
      .collection("judges")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          judges.push(doc.data());
        });
        this.setState({ judges });
      });
  }

  render() {
    const { judges } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>New Judge Account</h1>
                <div className="field field--half">
                  <label>
                    <span>Judge Name</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field field--half">
                  <label>
                    <span>Judge Email</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field">
                  <button type="submit" className="primary">
                    Create
                  </button>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Existing Judge Accounts</h1>
                <div className="field field--half">
                  <label>
                    <span>Search</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {judges.map((judge, index) => (
                        <tr key={judge.email}>
                          <td>{index + 1}</td>
                          <td>{judge.name}</td>
                          <td>{judge.email}</td>
                          <td>
                            <button>Delete</button>
                          </td>
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
