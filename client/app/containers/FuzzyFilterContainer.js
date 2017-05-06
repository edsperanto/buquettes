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

// dateConverters
const modConverter = time => {
	let year = parseInt(time.substr(0, 4));
	let month = parseInt(time.substr(5, 2));
	let date = parseInt(time.substr(8, 2));
	let hour = parseInt(time.substr(11, 2));
	let min = parseInt(time.substr(14, 2));
	let sec = parseInt(time.substr(17, 2));
	year = (year - 1960) * 3600 * 24 * 30 * 12;
	month = month * 3600 * 24 * 30;
	date = date * 3600 * 24;
	hour = hour * 3600;
	min = min * 60;
	return year + month + date + hour + min + sec;
}
const calcTimeDiffOf = (diffTime) => {
	let str = "";
	if(diffTime < 60) { 
		str = `${Math.floor(diffTime)} second`;
		str += (diffTime >= 2) ? ('s') : ('');
	}else if(diffTime >= 60 && diffTime < 3600) {
		str = `${Math.floor(diffTime / 60)} minute`;
		str += (diffTime / 60 >= 2) ? ('s') : ('');
	}else if(diffTime >= 3600 && diffTime < 86400) {
		str = `${Math.floor(diffTime / 3600)} hour`;
		str += (diffTime / 3600 >= 2) ? ('s') : ('');
	}else if(diffTime >= 86400 && diffTime < 604800) {
		str = `${Math.floor(diffTime / 86400)} day`;
		str += (diffTime / 86400 >= 2) ? ('s') : ('');
	}else if(diffTime >= 604800 && diffTime < 2629743) {
		str = `${Math.floor(diffTime / 604800)} week`;
		str += (diffTime / 604800 >= 2) ? ('s') : ('');
	}else if(diffTime >= 2629743 && diffTime < 31556926) {
		// average 30.44 days per month
		str = `${Math.floor(diffTime / 2629743)} month`;
		str += (diffTime / 2629743 >= 2) ? ('s') : ('');
	}else if(diffTime >= 31556926) {
		// average 365.24 days per year
		str = `${Math.floor(diffTime / 31556926)} year`;
		str += (diffTime / 31556926 >= 2) ? ('s') : ('');
	}
	return str + ' ago';
}

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
		clearInterval(window.myInterval);
	}

  handleChange = ( event ) => {
    this.setState({files: event.target.value});
  }

  serviceStates = _ => {
		return new Promise((resolve, reject) => {
			resolve(this.props.connected);
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
							})
							.then(data => data.map(entry => {
								entry.modified_at = modConverter(entry.modified_at);
								return entry;
							}));
					}else{
						return this.getSingleServiceData(service)
							.then(JSON.parse)
							.then(data => data.map(entry => {
								entry.source = 'github';
								entry.repo = 'GitHub/' + entry.repo;
								entry.type = (entry.type === 'tree' ? 'Folder' : 'File');
								entry.modified_at = modConverter(entry.modified_at);
								return entry;
							}));
					}
        })
      )
      .then(_flattenDeep)
    });
  }

  serviceFilesToElectron = () =>{
    this.allServiceFiles()
			.then(files =>{
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
							let curr = new Date().toISOString();
							let now = modConverter(curr);
               return(
                <div>
                  {
									filteredItems
										.sort((a, b) => {
											return b.modified_at - a.modified_at;
										})
										.map(file => {
											let unix = file.modified_at;
											let diff = now - unix;
											file.modified_at = calcTimeDiffOf(diff);
											return file;
										})
										.map(file => {
											return <div key={file.html_url ? file.html_url : JSON.stringify(file.id)}>
												<File
													name={file.name}
													path={file.path}
													repo={file.repo}
													html_url={file.html_url}
													modified_at={file.modified_at}
													type={file.type}
												/>
											</div>
										})
									}
                </div>
              )
            }}
          </FilterResults>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
		currentUser: state.users.currentUser,
		currentView: state.views.currentView,
		connected: state.data.connected
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
