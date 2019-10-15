import React from "react";
import firebase from "./Auth.js";

import "./style.css";

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.go = this.go.bind(this);
    this.requestPasswordReset = this.requestPasswordReset.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  go(event) {
    const { email, password } = this.state;
    const { history } = this.props;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function() {
        history.push("/events");
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        alert(errorCode);
        // ...
      });
    // Implement auth
    event.preventDefault();
  }

  requestPasswordReset() {}

  render() {
    const { email, password } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column column--thin">
            <div className="card card--center card--ghosted">
              <section className="fields">
                <div className="field">
                  <img
                    id="auth__logo"
                    src={require("./assets/logo.png")}
                    alt="Dreams for Schools"
                  />
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Log in</h1>
                <form onSubmit={this.go}>
                  <div className="field">
                    <label>
                      <span>Email</span>
                      <input
                        value={email}
                        onChange={this.handleEmailChange}
                        type="email"
                        autoComplete="email"
                        required
                      />
                    </label>
                  </div>
                  <div className="field">
                    <label>
                      <span>Password</span>
                      <input
                        value={password}
                        onChange={this.handlePasswordChange}
                        type="password"
                        autoComplete="current-password"
                        required
                      />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">
                      Continue
                    </button>
                  </div>
                </form>
              </section>
              <section className="fields">
                <div className="field">
                  <button onClick={this.requestPasswordReset}>
                    Reset Password
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
