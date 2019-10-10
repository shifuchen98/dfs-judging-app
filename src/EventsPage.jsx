import React from 'react';

import './style.css';

export default class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    const { history } = this.props;
    history.push('/'); // Implement auth
  }

  render() {
    const { history } = this.props;
    return (
      <div id="page">
        <div className="columns">
          <div className="column column--thin">
            <div className="card card--center card--ghosted">
              <section className="fields">
                <div className="field">
                  <img id="auth__logo" src={require('./assets/logo.png')} alt="Dreams for Schools" />
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Select an Event</h1>
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
                        <th>Name</th>
                        <th>Date</th>
                        <th>Enter</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Event 1</td>
                        <td>Oct 10, 2019</td>
                        <td><button className="primary" onClick={() => { history.push('/event/1/judges') }}>Enter</button></td>
                        <td><button>Delete</button></td>
                      </tr>
                      <tr>
                        <td>Event 2</td>
                        <td>Jun 11, 2019</td>
                        <td><button className="primary" onClick={() => { history.push('/event/2/judges') }}>Enter</button></td>
                        <td><button>Delete</button></td>
                      </tr>
                      <tr>
                        <td>Event 3</td>
                        <td>Jun 12, 2019</td>
                        <td><button className="primary" onClick={() => { history.push('/event/3/judges') }}>Enter</button></td>
                        <td><button>Delete</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="fields">
                <h1>Create an Event</h1>
                <div className="field field--half">
                  <label>
                    <span>Name</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field field--half">
                  <label>
                    <span>Date</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field">
                  <button type="submit" className="primary">Create</button>
                </div>
              </section>
              <section className="fields">
                <div className="field">
                  <button onClick={this.logOut}>Log out</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
