import React, {Component} from 'react';
import './index.css';

import {connect} from 'react-redux';
import {updateUsr, updatePswd, updateErr, updateCurr} from '../../actions';

class Login extends Component {

	handleUsr = e => this.props.onUpdateUsr(e.target.value);

	handlePswd = e => this.props.onUpdatePswd(e.target.value);

	submit = e => {
		e.preventDefault();
		const {usr, pswd} = this.props.loginForm;
		const xhr = new XMLHttpRequest();
		xhr.addEventListener('load', e => {
			let {success, error, currentUser} = JSON.parse(xhr.responseText);
			this.props.onUpdateErr(error);
			if(success) {
				this.props.onUpdateCurr(currentUser);
				this.props.history.push('/', null);
			}
		});
		xhr.open('POST', '/user/login', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify((usr.indexOf('@') > -1) ?
			({email: usr, password: pswd}) : ({username: usr, password: pswd})));
	}

	render() {
		return (
			<div id="login">
				<h1>Login</h1>
				<form action="/user/login" method="post" onSubmit={this.submit}>
					<div className="error" style={this.props.loginForm.error ?
						({}) : ({display: "none"})}>
	border
						{this.props.loginForm.error}
					</div>
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
		onUpdateUsr: usr => dispatch(updateUsr(usr)),
		onUpdatePswd: pswd => dispatch(updatePswd(pswd)),
		onUpdateErr: err => dispatch(updateErr(err)),
		onUpdateCurr: curr => dispatch(updateCurr(curr)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
