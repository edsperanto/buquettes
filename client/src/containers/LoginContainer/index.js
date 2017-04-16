import React, { Component } from 'react';

import FormTextInput from '../../components/FormTextInput';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div className="login-container">
        <FormTextInput
          name={"Username/Email"}
          id={"user"}
          onChange{this.onChange}
        />
      </div>
    )
  }
}