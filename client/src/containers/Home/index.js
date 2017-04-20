import React, { Component } from 'react';

import { connect } from 'react-redux';

class Home extends Component {
  render() {
    return (
      <div id="home">
        <h1>Welcome to <i>fabulous <b>Buquettes</b></i></h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
