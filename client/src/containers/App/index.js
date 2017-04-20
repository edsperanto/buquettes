import React, { Component } from 'react';

import Header from '../Header';
import Home from '../Home';
import Login from '../LoginContainer';
import Profile from '../Profile';
import SignUp from '../SignUp';

import {connect} from 'react-redux';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="route-container">
            <Header />
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/profile" component={Profile} />
            <Route path="/signup" component={SignUp} />
          </div>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
