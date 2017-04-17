import React, {Component} from 'react';

import './index.css';

import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import LoginBtn from '../../components/loginBtn';

class Header extends Component {
	handleLogout = e => {
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
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
