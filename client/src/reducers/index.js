import { combineReducers } from 'redux';
import files from './files';
import users from './users';
import data from './data';

const reducers = combineReducers({
  files,
  users,
	data
});

export default reducers;
