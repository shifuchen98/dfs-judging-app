import React from 'react';

import './style.css';

export default class TeamsPage extends React.Component {
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
                <h1>New Team</h1>
                <div className="field field--half">
                  <label>
                    <span>Team Name</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field field--half">
                  <label>
                    <span>App Name</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field field--half">
                  <label>
                    <span>School</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field field--half">
                  <label>
                    <span>Project Description</span>
                    <input type="text" />
                  </label>
                </div>
                <div className="field">
                  <button type="submit" className="primary">Create</button>
                </div>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Existing Teams</h1>
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
                        <th>Team Name</th>
                        <th>App Name</th>
                        <th>School</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Team 1</td>
                        <td>App 1</td>
                        <td>School 1</td>
                        <td><button>Delete</button></td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Team 2</td>
                        <td>App 2</td>
                        <td>School 2</td>
                        <td><button>Delete</button></td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Team 3</td>
                        <td>App 3</td>
                        <td>School 3</td>
                        <td><button>Delete</button></td>
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
