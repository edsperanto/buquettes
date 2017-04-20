import {
  LOGIN,
  UPDATE_LOGIN_USR,
  UPDATE_LOGIN_PSWD,
  UPDATE_LOGIN_ERR,
  UPDATE_CURR,
  LOGOUT_CURR,
  NEW_USERNAME,
  NEW_EMAIL,
  NEW_PASSWORD,
  NEW_FIRST_NAME,
  NEW_LAST_NAME,
  NEW_ERR,
} from '../actions';

const initialState = {
  currentUser: {
    authenticated: false
  },
  signupForm: {},
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
      });
    case UPDATE_CURR:
      return Object.assign({}, state, {
        currentUser: {
          username: action.username,
          email: action.email,
          first_name: action.first_name,
          last_name: action.last_name,
          authenticated: true,
        }
      });
    case LOGOUT_CURR:
      return Object.assign({}, state, {
        currentUser: {
          authenticated: false
        }
      });
    case NEW_USERNAME:
      return Object.assign({}, state, {
        signupForm: Object.assign(
          {},
          state.signupForm,
          {
            username: action.username
          }
        )
      });
    case NEW_EMAIL:
      return Object.assign({}, state, {
        signupForm: Object.assign(
          {},
          state.signupForm,
          {
            email: action.email
          }
        )
      });
    case NEW_PASSWORD:
      return Object.assign({}, state, {
        signupForm: Object.assign(
          {},
          state.signupForm,
          {
            password: action.password
          }
        )
      });
    case NEW_FIRST_NAME:
      return Object.assign({}, state, {
        signupForm: Object.assign(
          {},
          state.signupForm,
          {
            first_name: action.firstName
          }
        )
      });
    case NEW_LAST_NAME:
      return Object.assign({}, state, {
        signupForm: Object.assign(
          {},
          state.signupForm,
          {
            last_name: action.lastName
          }
        )
      });
    case NEW_ERR:
      return Object.assign({}, state, {
        signupForm: Object.assign(
          {},
          state.signupForm,
          {
            error: action.err
          }
        )
      });
    default:
      return state;
  }
}

export default users;
