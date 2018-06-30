import { combineReducers } from 'redux'
import { REQUEST_SEARCH, RECEIVE_SEARCH, ERROR_SEARCH, NO_INFORMATION_FOUND, REQUEST_TOPICS, RECEIVE_TOPICS, ERROR_TOPICS } from '../actions'

var general_default_state = {
  searchString: "",
  publications: [],
  isLoading: false,
  errorConnection: false
}

const general = (state=general_default_state, action) => {
  switch (action.type) {
    case REQUEST_SEARCH:
      return {
        ...state,
        searchString: action.searchString,
        isLoading: true,
        errorConnection: false,
        noInformationFound: false
      }
    case RECEIVE_SEARCH:
      return {
        ...state,
        publications: action.publications,
        isLoading: false
      }
    case ERROR_SEARCH:
      return {
        ...state,
        errorConnection: true,
        isLoading: false
      }
    case NO_INFORMATION_FOUND:
      return {
        ...state,
        noInformationFound: true,
        isLoading: false
      }
    default:
      return state
  }
}

var topics_default_state = {
  searchString: "",
  topics: [],
  isLoading: false,
  errorConnection: false
}

const topicsDiagram = (state=topics_default_state, action) => {

  switch (action.type) {
    case REQUEST_TOPICS:
      return {
        ...state,
        isLoading: true,
        errorConnection: false,
      }
    case RECEIVE_TOPICS:
    debugger;
      return {
        ...state,
        topics: action.topics,
        isLoading: false
      }
    case ERROR_TOPICS:
      return {
        ...state,
        errorConnection: true,
        isLoading: false
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  general,
  topicsDiagram
  // selectedSubreddit
})

export default rootReducer
