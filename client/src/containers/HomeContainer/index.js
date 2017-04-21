import React, { Component } from 'react';
import './index.css';

import { connect } from 'react-redux';

class HomeContainer extends Component {
	render() {
    if(this.props.currentUser.authenticated)
  		return (
  			<div id="home">
  				<h1>Welcome to <i>fabulous <b>Buquettes</b></i></h1>
  			</div>
  		);
    else
      return(
        <div>failed</div>
      )
	}
}

function mapStateToProps(state) {
	return {
    currentUser: state.users.currentUser,
    history: state.history,
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeContainer);
