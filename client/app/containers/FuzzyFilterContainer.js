import React, {Component} from 'react';
import { connect } from 'react-redux';
import fuzzyFilterFactory from 'react-fuzzy-filter';

import { addFile, updateView } from '../actions';
import File from '../components/File';

const electron_data = require('electron-data');
const _flattenDeep = require('lodash.flattendeep');


// these components share state and can even live in different components
const {InputFilter, FilterResults} = fuzzyFilterFactory();


class FuzzyFilterContainer extends Component {
  constructor(props){
    super(props)
    this.state = { files: [] }

  }
  handleChange = ( event ) => {
    this.setState(
      {
        files: event.target.value
      }
    )
  }
  componentWillMount() {
    electron_data.get('services').then(files=> {
     console.log("check it KT: ", JSON.parse(files[0]))
     this.setState ({
      files: JSON.parse(files[0])
     })

    })
    console.log('this.files: ', this.files)
    
  }

  render() {
  console.log('files: ', this.files)
    const fuseConfig = {
      shouldSort: true,
      includeScore: true,
      includeMatches: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name",
        "repo"
      ]
    };
    return (
      <div>
        <InputFilter debounceTime={200} />
        <div>Youre mother fuckin results</div>
        <FilterResults
          className="fuckyouman"
          items={this.state.files}
          fuseConfig={fuseConfig}
          onChange={this.handleChange}>
          {filteredItems => {
            console.log('filtered Items: ', filteredItems)
             return(
              <div>
                {filteredItems.map(file => 
                  <div> 
                    <File
                      name={file.name}
                      path={file.path}
                      repo={file.repo}
                      html_url={file.html_url}
                      modified_at={file.modified_at}
                      type={file.type}
                    />
                  </div>)}
              </div>
            )
          }}
        </FilterResults>
      </div>
    );
  }
}

export default FuzzyFilterContainer;