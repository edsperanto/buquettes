import React, { Component } from 'react';

class RegisterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
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
    let endpoint = '';
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
    return (
      <div className="register">
        <h2>Create a new account</h2>
        <form action="#">
          <label for="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={this.handleChange}
          />

          <label for="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={this.handleChange}
          />

          <label for="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            onChange={this.handleChange}
          />

          <label for="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            onChange={this.handleChange}
          />

          <label for="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            onChange={this.handleChange}
          />

          <input
            type="submit"
            value="Register"
            onClick={this.handleSubmit}
          />
        </form>
      </div>
    );
  }
}

export default RegisterContainer;