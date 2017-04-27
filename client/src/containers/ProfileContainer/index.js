import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateView } from '../../actions';
import './index.css';

class ProfileContainer extends Component {
  componentWillMount() {
    this.props.onUpdateView(this.props.location.pathname);
  }
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
		currentUser: state.users.currentUser,
    currentView: state.views.currentView
	}
}

function mapDispatchToProps(dispatch) {
	return {
    onUpdateView: view => dispatch(updateView(view))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileContainer);
