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
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Assigned.">✅</span></button></td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Assigned.">✅</span></button></td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Not assigned.">⬜</span></button></td>
                      </tr>
                      <tr>
                        <td>Bob</td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Assigned.">✅</span></button></td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Not assigned.">⬜</span></button></td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Assigned.">✅</span></button></td>
                      </tr>
                      <tr>
                        <td>Charlie</td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Not assigned.">⬜</span></button></td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Assigned.">✅</span></button></td>
                        <td><button style={{ width: '42px' }}><span role="img" aria-label="Assigned.">✅</span></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="field">
                  <button>Clear Assignment</button>
                </div>
              </section>
              <section className="fields">
                <h1>Auto Assign</h1>
                <div className="field field--half">
                  <label>
                    <span>Each Team Gets Judged</span>
                    <select required>
                      <option>1 Time</option>
                      <option>2 Times</option>
                      <option>3 Times</option>
                      <option>4 Times</option>
                      <option>5 Times</option>
                    </select>
                  </label>
                </div>
                <div className="field field--half">
                  <label>
                    <span>Each Judge Judges No More Than</span>
                    <select required>
                      <option>1 Team</option>
                      <option>2 Teams</option>
                      <option>3 Teams</option>
                      <option>4 Teams</option>
                      <option>5 Teams</option>
                    </select>
                  </label>
                </div>
                <div className="field">
                  <button className="primary">Perform Assignment</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
