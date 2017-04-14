import { GET_FILES } from '../actions';

const initialState = {
  files: []
}

function files(state = initialState, action) {
  switch( action.type ){
    case GET_FILES:
      console.log('getting files');
      return Object.assign({}, state, {
        files: [
        ...state.files,
        ]
      })
    default: return state;
  }
}

export default files;