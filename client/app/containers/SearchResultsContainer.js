import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFile } from '../actions';
import File from '../components/File';
import SearchFilter from '../components/SearchFilter';


class SearchResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.sources = ['github', 'box']
    this.state = {
      sources : []
    }
  }

  handleCheckbox = ( event ) => {

    if( event.target.checked === false){
      let newState = this.state.sources;
      let i = newState.indexOf(event.target.name);
      newState.splice(i, 1);
      this.setState(
        {
          sources: newState
        }
      )
    }

    if( event.target.checked === true){
      let newState = this.state.sources;
      newState.push(event.target.name);
      this.setState(
        {
          sources: newState
        }
      );
    }
  }

  componentWillMount() {
    let initialState = this.sources.slice();
    this.setState(
      {
        sources: initialState
      }
    )
  }

  render(){
    return(
      <div className="search-results">
        <div>
          <SearchFilter
            sources={this.sources}
            handleCheckbox={this.handleCheckbox}
          />
        </div>
        {
					this.props.files.files
						.filter(file => {
							for(let i = 0; i < this.state.sources.length; i++)
								if(file.path === this.state.sources[i]) return file;
						})
						.filter(file => {
							let name = file.name.toLowerCase();
							let query = this.props.query.toLowerCase();
							// return (query === "") ? true : (name.indexOf(query) > -1);
							return true;
						})
						.map(file => {
							return <File
								key={file.html_url ? file.html_url : JSON.stringify(file.id)}
								name={file.name}
								path={file.path}
								repo={file.repo}
								html_url={file.html_url}
								modified_at={file.modified_at}
							/>
						})
        }
      </div>
      )
    }
  }


const mapStateToProps = (state) => {
    return {
      files: state.files
    }
  };

const mapDispatchToProps = (dispatch) => {
  return {
    addFile: (name, path, repo, html_url, modified_at, type) => {
      dispatch(addFile(
        name,
        path,
        repo,
        html_url,
        modified_at,
        type
      ));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsContainer);
