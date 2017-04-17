import React from 'react';
import {Link} from 'react-router-dom';

const LoginBtn = (props) => {
	if(props.currentUser.authenticated)
		return (
			<div className="menu-btn">
				<div>
					<Link to="/profile">
						<div>{"Welcome, " + props.currentUser.first_name}</div>
					</Link>
					<Link to="/">
						<div onClick={props.handleLogout}>{"(logout)"}</div>
					</Link>
				</div>
			</div>
		);
	else
		return (
			<Link to="/login">
				<div className="menu-btn">Login</div>
			</Link>
		);
}

export default LoginBtn;
