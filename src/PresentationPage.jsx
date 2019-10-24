import React from 'react';

import AV from 'leancloud-storage';

import './style.css';

export default class PresentationPage extends React.Component {
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
                <h1>Presentation</h1>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
