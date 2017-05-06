import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { logoutCurr, updateCurr } from '../actions';
import LoginBtn from '../components/LoginBtn';

class HeaderContainer extends Component {

	// auto login user
	componentWillMount() {
		let xhr = new XMLHttpRequest();
		xhr.addEventListener('load', e => {
			let {success, currentUser} = JSON.parse(xhr.responseText);
			if(success) this.props.onUpdateCurr(currentUser);
		});
		xhr.open('GET', 'https://stratospeer.com/api/user/current');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();
	}

	handleLogout = e => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${this.props.url}/user/logout`);
		xhr.send();
		this.props.onLogoutCurr({authenticated: false});
	}

	render() {

		let menu = null;
		let login = <div key="login" id="menu">
			<LoginBtn
				currentUser={this.props.currentUser}
				handleLogout={this.handleLogout}
			/>
		</div>
		let signup = <Link key="signup" to="/signup">
			<div className="menu-btn">Signup</div>
		</Link>
		let services = <Link key="services" to="/services">
			<div className="menu-btn">services</div>
		</Link>
		let search = <Link key="search" to="/search">
			<div className="menu-btn">search</div>
		</Link>

		switch(this.props.currentView) {
			case '/login': menu = [signup]; break;
			case '/profile': menu = [login, services]; break;
			case '/signup': menu = [login]; break;
			case '/search': menu = [services]; break;
			case '/services': menu = [search]; break;
			default: menu = []; break;
		}

		return <div id="header">
			<Link key="title" to={this.props.currentUser.authenticated ? "/search" : "/login"}>
				<div id="title"><b>Stratospeer</b></div>
			</Link>
			{menu}
		</div>

	}
}

function mapStateToProps(state) {
	return {
		url: state.data.url,
		currentUser: state.users.currentUser,
		currentView: state.views.currentView,
		history: state.history
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onLogoutCurr: curr => dispatch(logoutCurr(curr)),
		onUpdateCurr: curr => dispatch(updateCurr(curr))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderContainer);
