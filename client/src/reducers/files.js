import { ADD_FILE } from '../actions';

const initialState = {
  files: []
}

function files(state = initialState, action) {
  switch( action.type ){
    case ADD_FILE:
    console.log('in reducer', action);
    return Object.assign({}, state, {
      files: [
        ...state.files,
        {
          id: action.id,
          source: action.source,
          name: action.name,
          createdAt: action.createdAt,
          lastModified: action.lastModified
        }
      ]
    })

    default:
      return state;
  }
}

export default files;