import React, { Component } from 'react';
import { connect } from 'react-redux';

import { isLoggedIn } from '../../helpers/isLoggedIn';
import './index.css';


class HomeContainer extends Component {

  componentWillMount() {
    isLoggedIn(this.props.currentUser, this.props);
  }

  render() {
		return (
			<div className="home-container">
        You haven't added any files yet
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
    currentUser: state.users.currentUser
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeContainer);
