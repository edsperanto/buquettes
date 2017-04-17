export const LOGIN = 'LOGIN';
export const UPDATE_LOGIN_USR = 'UPDATE_LOGIN_USR';
export const UPDATE_LOGIN_PSWD = 'UPDATE_LOGIN_PSWD';

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
