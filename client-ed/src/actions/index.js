export const LOGIN = 'LOGIN';
export const UPDATE_LOGIN_USR = 'UPDATE_LOGIN_USR';
export const UPDATE_LOGIN_PSWD = 'UPDATE_LOGIN_PSWD';
export const UPDATE_LOGIN_ERR = 'UPDATE_LOGIN_ERR';
export const UPDATE_CURR = 'UPDATE_CURR';
export const LOGOUT_CURR = 'LOGOUT_CURR';

export function login(username, email, first_name, last_name) {
	return {
		type: LOGIN,
		username,
		email,
		first_name,
		last_name,
	}
}

export function updateUsr(usr) {
	return {
		type: UPDATE_LOGIN_USR,
		usr
	}
}

export function updatePswd(pswd) {
	return {
		type: UPDATE_LOGIN_PSWD,
		pswd
	}
}

export function updateErr(err) {
	return {
		type: UPDATE_LOGIN_ERR,
		err
	}
}

export function updateCurr(curr) {
	return Object.assign({}, curr, {
		type: UPDATE_CURR
	});
}

export function logoutCurr() {
	return {
		type: LOGOUT_CURR
	}
}
