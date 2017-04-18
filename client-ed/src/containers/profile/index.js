import React, {Component} from 'react';

import './index.css';

import {connect} from 'react-redux';

class Profile extends Component {
	render() {
		let {username, email, first_name, last_name} = this.props.currentUser;
		let fullName = `${first_name} ${last_name}`;
		return (
			<div id="profile">
				<h1>Profile</h1>
				<h3>Name: {fullName}</h3>
				<h3>Username: {username}</h3>
				<h3>Email: {email}</h3>
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
