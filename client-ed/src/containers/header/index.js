import React, {Component} from 'react';

import './index.css';

import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

class Header extends Component {
	render() {
		return (
			<div id="header">
				<Link to="/">
					<div id="title"><b>Buquettes</b></div>
				</Link>
				<div id="menu">
					<Link to="/login">
						<div className="menu-btn">Login</div>
					</Link>
				</div>
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
)(Header);
