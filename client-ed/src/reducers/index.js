import {
	LOGIN,
	UPDATE_LOGIN_USR,
	UPDATE_LOGIN_PSWD,
	UPDATE_LOGIN_ERR,
} from '../actions';

const initialState = {
	currentUser: {},
	loginForm: {},
};

function users(state = initialState, action) {
	switch(action.type) {
		case LOGIN:
			return Object.assign({}, state, {
				currentUser: {
					username: action.username,
					email: action.email,
					first_name: action.first_name,
					last_name: action.last_name,
				}
			});
		case UPDATE_LOGIN_USR:
			return Object.assign({}, state, {
				loginForm: Object.assign(
					{}, 
					state.loginForm, 
					{
						usr: action.usr
					}
				)
			});
		case UPDATE_LOGIN_PSWD:
			return Object.assign({}, state, {
				loginForm: Object.assign(
					{}, 
					state.loginForm, 
					{
						pswd: action.pswd
					}
				)
			});
		case UPDATE_LOGIN_ERR:
			return Object.assign({}, state, {
				loginForm: Object.assign(
					{},
					state.loginForm,
					{
						error: action.err
					}
				)
			})
		default:
			return state;
	}
}

export default users;
