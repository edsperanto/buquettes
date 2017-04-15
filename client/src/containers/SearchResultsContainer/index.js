import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFile } from '../../actions';
import File from '../../components/File';


class SearchResultsContainer extends Component {

constructor(props) {
  super(props);
  this.state = {
    sources : ['github', 'googledrive']
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
  render(){
    return(
      <div className="search-results">
        <p>{this.state.sources}</p>
        <div>
          <ul>
            <li>
              <label>Github</label>
              <input
                type="checkbox"
                defaultChecked="on"
                name="github"
                onClick={this.handleCheckbox}
              />
            </li>
            <li>
              <label>Google Drive</label>
              <input
                type="checkbox"
                defaultChecked="on"
                name="googledrive"
                onClick={this.handleCheckbox}
              />
            </li>
          </ul>
        </div>
        {
          this.props.files.files.filter( file => {
            // check which sources are true and compare file sources to each of the true sources

          }).filter( file => {
            if( this.props.query === ""){
              return;
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