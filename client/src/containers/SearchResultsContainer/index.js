import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFile } from '../../actions';
import File from '../../components/File';


class SearchResultsContainer extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <div className="search-results">
        Results:
        {
          this.props.files.files.map( file => {
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