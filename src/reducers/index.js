import { combineReducers } from 'redux'
import { REQUEST_SEARCH, RECEIVE_SEARCH } from '../actions'

const general = (state = { }, action) => {
  switch (action.type) {
    case REQUEST_SEARCH:
      return {
        ...state,
        searchString: action.searchString,
        isLoading: true
      }
    case RECEIVE_SEARCH:
      return {
        ...state,
        publications: action.publications,
        isLoading: false,
        hasError: false
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
