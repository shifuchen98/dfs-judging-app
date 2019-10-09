import React from 'react';

import './style.css';

export default class WinnerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Results</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Place</th>
                        <th>School</th>
                        <th>Team</th>
                        <th>App</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>School 1</td>
                        <td>Team 1</td>
                        <td>App 1</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>School 2</td>
                        <td>Team 2</td>
                        <td>App 2</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>School 3</td>
                        <td>Team 3</td>
                        <td>App 3</td>
                        <td>0</td>
                      </tr>
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
