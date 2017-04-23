export const ADD_FILE = 'ADD_FILE';
export const LOGIN = 'LOGIN';
export const UPDATE_LOGIN_USR = 'UPDATE_LOGIN_USR';
export const UPDATE_LOGIN_PSWD = 'UPDATE_LOGIN_PSWD';
export const UPDATE_LOGIN_ERR = 'UPDATE_LOGIN_ERR';
export const UPDATE_CURR = 'UPDATE_CURR';
export const LOGOUT_CURR = 'LOGOUT_CURR';
export const NEW_USERNAME = 'NEW_USERNAME';
export const NEW_EMAIL = 'NEW_EMAIL';
export const NEW_PASSWORD = 'NEW_PASSWORD';
export const NEW_FIRST_NAME = 'NEW_FIRST_NAME';
export const NEW_LAST_NAME = 'NEW_LAST_NAME';
export const NEW_ERR = 'NEW_ERR';
export const UPDATE_BOX_DATA = 'UPDATE_BOX_DATA';
export const UPDATE_VIEW = 'UPDATE_VIEW';

export const updateUsr = usr => ({type: UPDATE_LOGIN_USR, usr});
export const updatePswd = pswd => ({type: UPDATE_LOGIN_PSWD, pswd});
export const updateErr = err => ({type: UPDATE_LOGIN_ERR, err});
export const updateCurr = curr => Object.assign({}, curr, {type: UPDATE_CURR});
export const logoutCurr = _ => ({type: LOGOUT_CURR});

export const newUsername = username => ({type: NEW_USERNAME, username});
export const newEmail = email => ({type: NEW_EMAIL, email});
export const newPassword = password => ({type: NEW_PASSWORD, password});
export const newFirstName = firstName => ({type: NEW_FIRST_NAME, firstName});
export const newLastName = lastName => ({type: NEW_LAST_NAME, lastName});
export const newErr = err => ({type: NEW_ERR, err});

export function login(username, email, first_name, last_name) {
  return {
    type: LOGIN,
    username,
    email,
    first_name,
    last_name,
  }
}

export function addFile(id, source, name, createdAt, lastModified) {
  return {
    type: ADD_FILE,
    id,
    source,
    name,
    createdAt,
    lastModified
  }
}

export function updateBoxData(entry) {
	return {
		type: UPDATE_BOX_DATA,
		entry
	}
}

export function updateView(view) {
  return {
    type: UPDATE_VIEW,
    view
  }
}