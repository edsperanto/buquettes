import React, {Component} from 'react';
import './index.css';

import {connect} from 'react-redux';
import {updateUsr, updatePswd} from '../../actions';

class Login extends Component {

	handleUsr = e => this.props.onUpdateUsr(e.target.value);

	handlePswd = e => this.props.onUpdatePswd(e.target.value);

	submit = (e) => {
		e.preventDefault();
		console.log(this.props.loginForm);
	}

	render() {
		return (
			<div id="login">
				<h1>Login</h1>
				<form action="/user/login" method="post" onSubmit={this.submit}>
					<div>
						<label>username</label>
						<input type="text" name="username" onChange={this.handleUsr} />
					</div>
					<div>
						<label>password</label>
						<input type="password" name="password" onChange={this.handlePswd} />
					</div>
					<div>
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		loginForm: state.loginForm,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onUpdateUsr: (usr) => dispatch(updateUsr(usr)),
		onUpdatePswd: (pswd) => dispatch(updatePswd(pswd)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
