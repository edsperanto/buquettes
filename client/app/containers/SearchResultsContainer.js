import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFile } from '../actions';
import File from '../components/File';
import SearchFilter from '../components/SearchFilter';


class SearchResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.sources = ['github', 'googledrive']
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
          this.props.files.files.filter( file => {
            for( let i = 0; i < this.state.sources.length; i++ ){
              if(file.source === this.state.sources[i]){
                return file;
              };
            }
						return 0;
          }).filter( file => {
            if( this.props.query === ""){
              return 0;
            }else{
              return file.name.toLowerCase().indexOf(this.props.query.toLowerCase()) !== -1;
            }
          }).map( file => {
            return (
              <File
                id={file.id}
                source={file.source}
                name={file.name}
                createdAt={file.createdAt}
                lastModified={file.lastModified}
              />
            )
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
    addFile: (id, source, name, createdAt, lastModified) => {
      dispatch(addFile(
        id,
        source,
        name,
        createdAt,
        lastModified
      ));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsContainer);
