import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import firebase from "firebase/app";

const withAuthProtection = redirectPath => WrappedComponent => {
  class WithAuthProtection extends React.Component {
    componentDidMount() {
      // use history from parent.
      const { history } = this.props;
      if (!firebase.auth().currentUser) {
        // no auth at the beginning of the app, redirect them to login.
        return history.push(redirectPath);
      }
    }
    componentWillReceiveProps(nextProps) {
      const { user, history } = this.props;
      const { user: nextMe } = nextProps;
      if (user && !nextMe) {
        // this case is a must,
        // if user stay at auth route while they signing out
        // we must take them to login again immediately.
        history.push(redirectPath);
      }
    }

    render() {
      const { user } = this.props;
      if (!user) {
        // don't render anything if no auth
        return null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  return WithAuthProtection;
};

export default withAuthProtection;
