import React, {Component} from 'react';
import './index.css';

import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logoutCurr} from '../../actions';
import LoginBtn from '../../components/loginBtn';

class Header extends Component {
	handleLogout = e => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', '/user/logout', true);
		xhr.send();
		this.props.onLogoutCurr({authenticated: false});
	}
	render() {
		return (
			<div id="header">
				<Link to="/">
					<div id="title"><b>Buquettes</b></div>
				</Link>
				<div id="menu">
					<LoginBtn 
						currentUser={this.props.currentUser} 
						handleLogout={this.handleLogout}
					/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
		history: state.history,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onLogoutCurr: curr => dispatch(logoutCurr(curr))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
