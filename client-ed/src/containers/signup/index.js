import React, {Component} from 'react';
import './index.css';

import {connect} from 'react-redux';
import {
	newUsername, newEmail, newPassword,
	newFirstName, newLastName, newErr
} from '../../actions';

class SignUp extends Component {

	handleUsername = e => this.props.onUpdateUsername(e.target.value);
	handleEmail = e => this.props.onUpdateEmail(e.target.value);
	handlePassword = e => this.props.onUpdatePassword(e.target.value);
	handleFirstName = e => this.props.onUpdateFirstName(e.target.value);
	handleLastName = e => this.props.onUpdateLastName(e.target.value);

	submit = e => {
		e.preventDefault();
		const xhr = new XMLHttpRequest();
		xhr.addEventListener('load', e => {
			let {success, error} = JSON.parse(xhr.responseText);
			if(success) this.props.history.push('/login', null);
			else this.props.onUpdateError(error);
		});
		xhr.open('POST', '/user/new', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(this.props.signupForm));
	}

	render() {
		return (
			<div id="signup">
				<h1>Sign Up</h1>
				<form action="/user/new" method="post" onSubmit={this.submit}>
					<div className="error" style={this.props.signupForm.error ?
						({}) : ({display: "none"})}>
	border
						{this.props.signupForm.error}
					</div>
					<div>
						<label>username</label>
						<input type="text" name="username" onChange={this.handleUsername} />
					</div>
					<div>
						<label>email</label>
						<input type="text" name="email" onChange={this.handleEmail} />
					</div>
					<div>
						<label>password</label>
						<input type="password" name="password" onChange={this.handlePassword} />
					</div>
					<div>
						<label>first name</label>
						<input type="text" name="first_name" onChange={this.handleFirstName} />
					</div>
					<div>
						<label>last name</label>
						<input type="text" name="last_name" onChange={this.handleLastName} />
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
		signupForm: state.signupForm
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onUpdateUsername: username => dispatch(newUsername(username)),
		onUpdateEmail: email => dispatch(newEmail(email)),
		onUpdatePassword: password => dispatch(newPassword(password)),
		onUpdateFirstName: firstName => dispatch(newFirstName(firstName)),
		onUpdateLastName: lastName => dispatch(newLastName(lastName)),
		onUpdateError: error => dispatch(newErr(error)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUp);
