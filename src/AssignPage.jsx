import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class AssignPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {

    }
  }

  render() {
    const { } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Current Assignment</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Judge</th>
                        <th>Team 1</th>
                        <th>Team 2</th>
                        <th>Team 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Alice</td>
                        <td>x</td>
                        <td>x</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Bob</td>
                        <td>x</td>
                        <td></td>
                        <td>x</td>
                      </tr>
                      <tr>
                        <td>Charlie</td>
                        <td></td>
                        <td>x</td>
                        <td>x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button className="primary">Auto Assign</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
