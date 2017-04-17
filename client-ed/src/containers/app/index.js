import React, { Component } from 'react';

import './index.css';

import Header from '../header';
import Home from '../home';
import Login from '../login';
import Profile from '../profile';

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
