import React, { Component } from 'react';
import './index.css';

import {connect} from 'react-redux';
import {updateBoxData} from '../../actions';

class FoldersContainer extends Component {
  componentWillMount() {
const xhr = new XMLHttpRequest();
const genSearchableArr = (obj, dir) => {
	Object.keys(obj).forEach(item => {
		let searchEntry = {name: item, path: dir};
		let {id, children} = obj[item];
		searchEntry.id = id;
		if(!!children) {
			let newPath = dir + `/${item}`;
			searchEntry.type = 'folder';
			genSearchableArr(obj[item].children, newPath);
		}else{
			searchEntry.type = 'file';
		}
		this.props.onUpdateBoxData(searchEntry);
	});
}
xhr.addEventListener('load', e => {
	let {success, directory_structure} = JSON.parse(xhr.responseText);
	if(success) {
		let parsedArr = genSearchableArr(directory_structure, '/Box');
	}
});
xhr.open('GET', '/oauth2/box/folders', true);
xhr.send();
  }
  render(){
    return (
      <p id="output"></p>
    )
  }
}

function mapStateToProps(state) {
	return {
		data: state.data.data.Box,
		loginForm: state.users.loginForm,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onUpdateBoxData: entry => dispatch(updateBoxData(entry))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FoldersContainer);
