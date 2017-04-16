import React, { Component } from 'react';

import FormTextInput from '../../components/FormTextInput';
import FormSubmit from '../../components/FormSubmit';

class RegisterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      first_name: '',
      last_name: ''
    }
  }

  handleChange = ( event ) => {
    this.setState(
      {
        [event.target.name]: event.target.value
      }
    )
  }

  handleSubmit = ( event ) => {
    event.preventDefault();
    let endpoint = 'http://localhost:8080/user/new';
    let q = '';

    for (name in this.state){
       q +=  encodeURIComponent(name) + "=" + encodeURIComponent(this.state[name]) + "&";
    }

    let http = new XMLHttpRequest();
    http.open("POST", endpoint);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send(q);
  }
// does this do a login and redirect also?

  render() {
    return (
      <div className="register">
        <h2>Create a new account</h2>
        <form action="#">
          <FormTextInput
            label="Username"
            name="username"
            id="username"
            onChange={this.handleChange}
            state="default"
          />
          <FormTextInput
            label="Email"
            name="email"
            id="email"
            onChange={this.handleChange}
            state="default"
          />

          <FormTextInput
            type="password"
            label="Password"
            name="password"
            id="password"
            onChange={this.handleChange}
            state="default"
          />
          <FormTextInput
            type="not a pass"
            label="First Name"
            name="first_name"
            id="first_name"
            onChange={this.handleChange}
            state="default"
          />
          <FormTextInput
            label="Last Name"
            name="last_name"
            id="last_name"
            onChange={this.handleChange}
            state="default"
          />

          <FormSubmit
            state="default"
            onClick={this.handleSubmit}
            value="Register"
          />
        </form>
      </div>
    );
  }
}

export default RegisterContainer;