import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFile, updateView } from '../actions';
import SearchInput from '../components/SearchInput';
import SearchButton from '../components/SearchButton';
import SearchResultsContainer from './SearchResultsContainer';

const files = [
  {
    id: 1,
    path: 'github',
    name: 'file1',
    repo: 'myrepo',
    html_url: 'April. 22, 2017',
    modified_at: 'April 24, 2022',
    type:'file'
  },
  {
    id: 2,
    path: 'github',
    name: 'file2',
    repo: 'myrepo',
    html_url: 'April. 23, 2017',
    modified_at: 'April 25, 2022',
    type:'file'
  },
  {
    id: 3,
    path: 'github',
    name: 'fileHow are you',
    repo: 'myrepo',
    html_url: 'April. 24, 2017',
    modified_at: 'April 26, 2022',
    type:'file'
  },
  {
    id: 4,
    path: 'googledrive',
    repo: 'myrepo',
    name: 'Im great how about you.png',
    html_url: 'April. 25, 2017',
    modified_at: 'April 27, 2022',
    type:'file'
  }
];

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    }
  }

  handleChange = ( event ) => {
    this.setState(
      {
        query: event.target.value
      }
    )
  }

  openPath = (event) => {
    open('www.facebook.com')
  }

  filterResults = ( event ) => {
    this.props.files.files.filter( file => {
      return file.name === this.state.query;
    });
  }

  sendData = ( event ) => {
    console.log('hello');
  }

  componentWillMount() {
		console.log('WILL MOUNT');
		console.log('currentUser: ', this.props.currentUser);
		if(!this.props.currentUser.authenticated) {
			this.props.history.push('/login');
		}else{
			this.props.onUpdateView(this.props.location.pathname);
			files.map( file => {
				return this.props.onAddFile(
					file.id,
					file.source,
					file.name,
					file.createdAt,
					file.lastModified
				);
			});
		}
  }

  render(){
    console.log('this.props', this.props)
    return (
      <div className="search-container">
        <div className="search-form">
          <SearchInput
            handleChange={this.handleChange}
          />
          <SearchButton
            sendData={this.sendData}
          />
        </div>
          <SearchResultsContainer
            query={this.state.query}
            filterResults={this.filterResults}
          />
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.files,
    currentUser: state.users.currentUser,
    url: state.data.url
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddFile: ( name, path, repo, html_url, modified_at, type ) => {
      dispatch(addFile(
        name,
        path,
        repo,
        html_url,
        modified_at,
        type
      ));
    },
    onUpdateView: view => dispatch(updateView(view))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer);
