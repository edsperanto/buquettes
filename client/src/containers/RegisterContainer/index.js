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

  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value
      }
    )
  }

  render() {
    return (
      <div className="register">
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
        </form>
      </div>
    );
  }
}

export default RegisterContainer;