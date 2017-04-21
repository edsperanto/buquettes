import React, { Component } from 'react';

import './index.css';

import HeaderContainer from '../HeaderContainer';
import HomeContainer from '../HomeContainer';
import LoginContainer from '../LoginContainer';
import ProfileContainer from '../ProfileContainer';
import SignUpContainer from '../SignUpContainer';
import SearchContainer from '../SearchContainer'
import ServicesContainer from '../ServicesContainer'

import { connect } from 'react-redux';

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
						<HeaderContainer/>
						<Route exact path="/" component={HomeContainer} />
						<Route path="/login" component={LoginContainer} />
						<Route path="/profile" component={ProfileContainer} />
            <Route path="/signup" component={SignUpContainer} />
            <Route path="/search" component={SearchContainer} />
            <Route path="/services" component={ServicesContainer} />
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
