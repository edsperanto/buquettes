import { combineReducers } from 'redux';
import files from './files';
import users from './users';
import data from './data';
import views from './views';

const reducers = combineReducers({
  files,
  users,
	data,
  views
});

export default reducers;
