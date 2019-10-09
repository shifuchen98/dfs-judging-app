import React from 'react';

import './style.css';

export default class JudgesPage extends React.Component {
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
                  <button type="submit" className="primary">Create</button>
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
                      <tr>
                        <td>1</td>
                        <td>Alice</td>
                        <td>a@test.com</td>
                        <td><button>Delete</button></td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Bob</td>
                        <td>b@test.com</td>
                        <td><button>Delete</button></td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Charlie</td>
                        <td>c@test.com</td>
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
