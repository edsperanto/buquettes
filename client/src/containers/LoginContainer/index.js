import React, { Component } from 'react';

import FormTextInput from '../../components/FormTextInput';
import FormSubmit from '../../components/FormSubmit';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
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

    let http = new XMLHttpRequest();
    http.open("POST", endpoint);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send(q);
  }

  render() {
    return(
      <div className="login-container">
        <form action="#">
          <FormTextInput
            name={"Username/Email"}
            id={"user"}
            onChange{this.onChange}
            state={"default"}
          />
          <FormTextInput
            name={"Password"}
            id={"password"}
            type={"password"}
            onChange{this.onChange}
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