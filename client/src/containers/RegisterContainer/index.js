import React, { Component } from 'react';

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
    let endpoint = 'http://localhost:9000/user/new';
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
          <label>
            Username
            <input
              type="text"
              name="username"
              id="username"
              onChange={this.handleChange}
            />
          </label>

          <label>
            Email
            <input
              type="text"
              name="email"
              id="email"
              onChange={this.handleChange}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              id="password"
              onChange={this.handleChange}
            />
          </label>

          <label>
            First Name
            <input
              type="text"
              name="first_name"
              id="first_name"
              onChange={this.handleChange}
            />
          </label>

          <label>
            Last Name
            <input
              type="text"
              name="last_name"
              id="last_name"
              onChange={this.handleChange}
            />
          </label>

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