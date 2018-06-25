import { combineReducers } from 'redux'
import { REQUEST_SEARCH, RECEIVE_SEARCH } from '../actions'

const general = (state = { }, action) => {
  switch (action.type) {
    case REQUEST_SEARCH:
      return {
        ...state,
        searchString: action.searchString
      }
    case RECEIVE_SEARCH:
      return {
        ...state,
        publications: action.publications
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  general,
  // selectedSubreddit
})

export default rootReducer
