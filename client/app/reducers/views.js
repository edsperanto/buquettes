import { UPDATE_VIEW } from '../actions';

const initialState = {
  currentView: ''
}

function views(state = initialState, action) {
  switch( action.type ){
    case UPDATE_VIEW:
    return Object.assign({}, state, {
      currentView: action.view
    })
    default:
    return state;
  }
}

export default views;
