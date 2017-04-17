import React, { Component } from 'react';

import FormTextInput from '../../components/FormTextInput';
import FormSubmit from '../../components/FormSubmit';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
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
    let endpoint = 'http://localhost:8080/user/login';
    let q = '';

    for (name in this.state){
      q +=  encodeURIComponent(name) + "=" + encodeURIComponent(this.state[name]) + "&";
    }
    function httpListener(){
      console.log('response', this.responseText);
    }
    let http = new XMLHttpRequest();
    http.open("POST", endpoint);
    http.addEventListener('load', httpListener);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send(q);
  }

  render() {
    return(
      <div className="login-container">
        <form action="#">
          <FormTextInput
            label={"Username/Email"}
            id={"username"}
            name={"username"}
            onChange={this.handleChange}
            state={"default"}
          />
          <FormTextInput
            label={"Password"}
            id={"password"}
            name={"password"}
            type={"password"}
            onChange={this.handleChange}
            state={"default"}
          />
          <FormSubmit
            state="default"
            onClick={this.handleSubmit}
            value="Log in"
          />
        </form>
      </div>
    )
  }
}

export default LoginContainer;