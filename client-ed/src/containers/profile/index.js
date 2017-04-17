import React, {Component} from 'react';

import './index.css';

import {connect} from 'react-redux';

class Profile extends Component {
	render() {
		return (
			<div id="profile">
				<h1>Profile</h1>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
