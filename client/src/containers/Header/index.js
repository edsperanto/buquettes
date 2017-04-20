import React, {Component} from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutCurr } from '../../actions';
import LoginButton from '../../components/LoginButton';

class Header extends Component {
  handleLogout = e => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/user/logout', true);
    xhr.send();
    this.props.onLogoutCurr({authenticated: false});
  }
  render() {
    return (
      <div id="header">
        <Link to="/">
          <div id="title"><b>Buquettes</b></div>
        </Link>
        <div id="menu">
          <LoginButton
            currentUser={this.props.currentUser}
            handleLogout={this.handleLogout}
          />
        </div>
        <Link to="/signup">
          <div className="menu-btn">Signup</div>
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    history: state.history,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onLogoutCurr: curr => dispatch(logoutCurr(curr))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
