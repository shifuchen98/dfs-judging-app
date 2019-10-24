import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class ExportPage extends React.Component {
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
                <h1>Raw Data</h1>
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
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Bob</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Charlie</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button className="primary">Export as CSV</button>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Normalized Data</h1>
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
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Bob</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Charlie</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button className="primary">Export as CSV</button>
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
                        <th>Score</th>
                        <th>Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Team 1</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Team 2</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Team 3</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="field">
                  <button className="primary">Export as CSV</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
