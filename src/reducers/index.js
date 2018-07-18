import { combineReducers } from 'redux'
import { REQUEST_SEARCH, RECEIVE_SEARCH, ERROR_SEARCH, NO_INFORMATION_FOUND, REQUEST_TOPICS, RECEIVE_TOPICS, ERROR_TOPICS } from '../actions'

// Define props for each state for general information search
// set default values
var general_default_state = {
  searchString: "",
  publications: [],
  isLoading: false,
  errorConnection: false,
  startScreen:true
}


const general = (state=general_default_state, action) => {
  switch (action.type) {
    // define props for search request
    case REQUEST_SEARCH:
      return {
        ...state,
        searchString: action.searchString,
        isLoading: true,
        errorConnection: false,
        noInformationFound: false,
        publications: [],
        startScreen: false,
      }
    // if search has been received start publications
    case RECEIVE_SEARCH:
      return {
        ...state,
        publications: action.publications,
        isLoading: false
      }
    // if there is no connection to the server show error
    case ERROR_SEARCH:
      return {
        ...state,
        errorConnection: true,
        isLoading: false
      }
    // if there is no informaiton about the author show error
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
// Define props for each state for topic search
var topics_default_state = {
  topics: [],
  isLoading: false,
  errorConnection: false
}

const topicsDiagram = (state=topics_default_state, action) => {

  switch (action.type) {
    // start screen
    case REQUEST_SEARCH:
      return {
        ...state,
        topics: []
      }
    // start search for topic information
    case REQUEST_TOPICS:
      return {
        ...state,
        isLoading: true,
        errorConnection: false,
      }
    // search for topic information was successful
    case RECEIVE_TOPICS:
      return {
        ...state,
        topics: action.topics,
        isLoading: false
      }
      // if there is no connection to the server show error 
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
