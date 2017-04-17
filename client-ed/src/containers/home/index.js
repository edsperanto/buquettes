import React, {Component} from 'react';
import './index.css';

import {connect} from 'react-redux';

class Home extends Component {
	render() {
		return (
			<div id="home">
				<h1>Welcome to <i>Buquettes</i></h1>
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
