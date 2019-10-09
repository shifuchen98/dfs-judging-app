import React from 'react';

import './style.css';

export default class TotalPage extends React.Component {
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
                <h1>Team 1</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Judge</th>
                        <th>Design 1</th>
                        <th>Design 2</th>
                        <th>Functionality 1</th>
                        <th>Functionality 2</th>
                        <th>Theme 1</th>
                        <th>Theme 2</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Alice</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Bob</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Team 2</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Judge</th>
                        <th>Design 1</th>
                        <th>Design 2</th>
                        <th>Functionality 1</th>
                        <th>Functionality 2</th>
                        <th>Theme 1</th>
                        <th>Theme 2</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Bob</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Charlie</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Team 3</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Judge</th>
                        <th>Design 1</th>
                        <th>Design 2</th>
                        <th>Functionality 1</th>
                        <th>Functionality 2</th>
                        <th>Theme 1</th>
                        <th>Theme 2</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Alice</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Charlie</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
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
