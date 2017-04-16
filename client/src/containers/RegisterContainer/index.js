import React, { Component } from 'react';

class RegisterContainer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="register">
        <form action="#">
          <label for="username">Username</label>
          <input type="text" name="username" id="username"/>

          <label for="email">Email</label>
          <input type="text" name="email" id="email"/>

          <label for="first_name">First Name</label>
          <input type="text" name="first_name" id="first_name"/>

          <label for="last_name">Last Name</label>
          <input type="text" name="last_name" id="last_name"/>

          <label for="password">Password</label>
          <input type="text" name="password" id="password"/>
        </form>
      </div>
    );
  }
}

export default RegisterContainer;