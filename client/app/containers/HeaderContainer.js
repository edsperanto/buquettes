import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { logoutCurr, updateCurr } from '../actions';
import LoginBtn from '../components/LoginBtn';

class HeaderContainer extends Component {

	componentWillMount() {
		console.log('MOUNTING HEADER');
		let xhr = new XMLHttpRequest();
		xhr.addEventListener('load', e => {
			console.log('LOADED');
			console.log('response: ', xhr.responseText);
			let {success, currentUser} = JSON.parse(xhr.responseText);
			if(success) this.props.onUpdateCurr(currentUser);
		});
		xhr.open('GET', 'https://stratospeer.com/api/user/current', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();
	}

	handleLogout = e => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${this.props.url}/user/logout`, true);
		xhr.send();
		this.props.onLogoutCurr({authenticated: false});
	}
	render() {
    if(this.props.hidden)
      return null;
    if(!this.props.hidden)
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
  				<Link to="/signup">
  					<div className="menu-btn">Signup</div>
  				</Link>
          <Link to="/search">
            <div className="menu-btn">Search</div>
          </Link>
          <Link to="/services">
            <div className="menu-btn">services</div>
          </Link>
  			</div>
  		);
	}
}

function mapStateToProps(state) {
	return {
		url: state.data.url,
		currentUser: state.users.currentUser,
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
