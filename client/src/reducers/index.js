import { combineReducers } from 'redux';
import files from './files';
import users from './users';

const reducers = combineReducers({
  files,
  users
});

export default reducers;