import React, {Component} from 'react';
import { connect } from 'react-redux';
import fuzzyFilterFactory from 'react-fuzzy-filter';

import { addFile, updateView } from '../actions';
import File from '../components/File';
import SearchResultsContainer from './SearchResultsContainer';

const electron_data = require('electron-data');
const _flattenDeep = require('lodash.flattendeep');


// these components share state and can even live in different components
const {InputFilter, FilterResults} = fuzzyFilterFactory();


class FuzzyFilterContainer extends Component {

  constructor(props){
    super(props)
    this.state = { files: [] }
  }

	componentWillMount() {
		if(!this.props.currentUser.authenticated)
			this.props.history.push('/login', null);
		this.props.onUpdateView(this.props.location.pathname);
		this.serviceFilesToElectron();
	}

  handleChange = ( event ) => {
    this.setState({files: event.target.value});
  }

  serviceStates = _ => {
		return new Promise((resolve, reject) => {
			function reqListener() {
				let data = JSON.parse(this.responseText);
				resolve(data);
			}
			const oReq = new XMLHttpRequest();
			oReq.addEventListener('load', reqListener);
			oReq.open('GET', 'https://www.stratospeer.com/api/oauth2/all', true);
			oReq.send();
		});
	};

	getSingleServiceData = (service) => {
		return new Promise((resolve, reject) => {
			const oReq = new XMLHttpRequest();
			oReq.addEventListener('load', _ => resolve(oReq.responseText));
			oReq.open('GET', `https://www.stratospeer.com/api/oauth2/${service}/search`, true);
			oReq.send();
		});
	}

  allServiceFiles = () => {
    return this.serviceStates().then(obj => {
      return Promise.all(Object.keys(obj).filter(key => {
          return obj[key] === true
        })
        .map(service => {
					if(service === 'box') {
						const genSearchableArr = (data, path) => {
							return new Promise((resolve, reject) => {
								let count = 0;
								let finalArr = [];
								const traverse = (obj, dir) => {
									Object.keys(obj).forEach(item => {
										count++;
										let searchEntry = {name: item, path: dir};
										let {id, children, modified_at} = obj[item];
										Object.assign(searchEntry, {id, modified_at});
										searchEntry.repo = 'Box';
										searchEntry.source = 'box';
										if(!!children) {
											let newPath = dir + `/${item}`;
											searchEntry.type = 'Folder';
											traverse(obj[item].children, newPath);
										}else{
											searchEntry.type = 'File';
										}
										count--;
										finalArr.push(searchEntry);
										if(count === 0) resolve(finalArr);
									});
								}
								traverse(data, path);
							});
						}
						return this.getSingleServiceData(service)
							.then(data => {
								let parsed = JSON.parse(data).directory_structure.children;
								return genSearchableArr(parsed, '/Box');
							});
					}else{
						return this.getSingleServiceData(service)
							.then(JSON.parse)
							.then(data => data.map(entry => {
								entry.source = 'github';
								entry.repo = 'GitHub/' + entry.repo;
								entry.type = (entry.type === 'tree' ? 'Folder' : 'File');
								return entry;
							}));
					}
        })
      )
      .then(_flattenDeep)
    });
  }

  serviceFilesToElectron = () =>{
    this.allServiceFiles().then(files =>{
      electron_data.config({
				filename: 'service_data',
				path: "",
				prettysave: true
			});
      electron_data.set('services', files);
      electron_data.save()
        .then( error => {
					if(error) console.log('error: ', error);
					return electron_data.get('services')
        })
				.then(files => this.setState({files}));
    });
  }

  render() {
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
      <div className="search-container">
        <InputFilter className="search-input" debounceTime={200} />
        <div className="search-results">
          <FilterResults
            items={this.state.files}
            defaultAllItems={false}
            fuseConfig={fuseConfig}
            onChange={this.handleChange}>
            {filteredItems => {
               return(
                <div>
                  {filteredItems.map(file =>
                    <div key={file.html_url ? file.html_url : JSON.stringify(file.id)}>
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
        <SearchResultsContainer/>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
		currentUser: state.users.currentUser,
		currentView: state.views.currentView
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onUpdateView: view => dispatch(updateView(view))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FuzzyFilterContainer);
