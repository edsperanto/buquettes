import React, { Component } from 'react';

import './index.css';

import HeaderContainer from '../HeaderContainer';
import HomeContainer from '../HomeContainer';
import LoginContainer from '../LoginContainer';
import ProfileContainer from '../ProfileContainer';
import SignUpContainer from '../SignUpContainer';
import SearchContainer from '../SearchContainer';
import FoldersContainer from '../FoldersContainer';

import { connect } from 'react-redux';

import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

class App extends Component {
  render() {
    console.log('window', window.location.pathname);
    return (
      <div className="App">
				<Router>
					<div className="route-container">
						<HeaderContainer
              path={window.location.pathname}
            />
						<Route exact path="/" component={HomeContainer} />
						<Route path="/login" component={LoginContainer} />
						<Route path="/profile" component={ProfileContainer} />
            <Route path="/signup" component={SignUpContainer} />
            <Route path="/search" component={SearchContainer} />
						<Route path="/box/folders" component={FoldersContainer} />
					</div>
				</Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
    currentUser: state.users.currentUser
	}
}

export default connect(
	mapStateToProps
)(App);
