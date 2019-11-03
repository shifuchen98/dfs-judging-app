import React from 'react';

import AV from 'leancloud-storage/live-query';

import './style.css';

export default class JudgePage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      user: AV.Object.createWithoutData('_User', match.params.uid),
      name: '',
      email: ''
    };
    this.fetchUser = this.fetchUser.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push('/');
    } else {
      this.fetchUser();
    }
  }

  fetchUser() {
    const { user } = this.state;
    user
      .fetch()
      .then(user => {
        this.setState({ user, name: user.get('name'), email: user.get('email') });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  updateUser(e) {
    const { history, match } = this.props;
    const { user, name, email } = this.state;
    AV.Cloud.rpc('updateUser', { user, name, email })
      .then(() => {
        alert('Judge information updated.');
        history.push(`/event/${match.params.id}/judges`);
      })
      .catch(error => {
        alert(error);
      });
    e.preventDefault();
  }

  render() {
    const { name, email } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Edit Judge</h1>
                <form onSubmit={this.updateUser}>
                  <div className="field field--half">
                    <label>
                      <span>Name</span>
                      <input type="text" value={name} onChange={this.handleNameChange} required />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>Email</span>
                      <input type="text" value={email} onChange={this.handleEmailChange} required />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">Save</button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
