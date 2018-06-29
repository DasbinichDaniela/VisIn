export const REQUEST_SEARCH = 'REQUEST_SEARCH'
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH'
export const ERROR_SEARCH = 'ERROR_SEARCH'
export const NO_INFORMATION_FOUND = 'NO_INFORMATION_FOUND'
export const REQUEST_TOPICS = 'REQUEST_TOPICS'
export const RECEIVE_TOPICS = 'RECEIVE_TOPICS'
export const ERROR_TOPICS = 'ERROR_TOPICS'

export const requestSearch = searchString => ({
  type: REQUEST_SEARCH,
  searchString
  // searchString: searchString
})

// export const receiveSearch = function(searchString, json){
//   debugger;
//   return {
//     type: RECEIVE_SEARCH,
//     searchString,
//     publications: json.data.children.map(child => child.data)
//   }
// }

export const receiveSearch = (searchString, json) => {
  // debugger;
  return {
    type: RECEIVE_SEARCH,
    searchString,
    publications: json
  }
}

// export const receiveSearch = (searchString, json) => ({
//   type: RECEIVE_SEARCH,
//   searchString,
//   publications: json.data.children.map(child => child.data)
// })

export const noInformationFound = searchString => ({
  type: NO_INFORMATION_FOUND,
  searchString,
})

export const errorSearch = searchString => ({
  type: ERROR_SEARCH,
  searchString,
})

export const startSearch = (searchString) => {
  return (dispatch) => {
    dispatch(requestSearch(searchString))
    fetch(`http://api.vissights.net/v2/dblp/author/search?authorname=Kawa%20Nazemi`)
      .then((response) => response.json())
      .then((json) => {
        if(json.length === 0){
          dispatch(noInformationFound())
        }else {
          dispatch(receiveSearch(searchString, json))
          dispatch(startFetchTopics())
        }
        })
      .catch(error => {
        dispatch(errorSearch(searchString))
      })
  }
}

export const requestTopics = () => ({
  type: REQUEST_TOPICS,
})

export const receiveTopics = (json) => ({
  type: RECEIVE_TOPICS,
  topics: json
})

export const errorTopics = () => ({
  type: ERROR_TOPICS,
})

export const startFetchTopics = () => {
  return (dispatch) => {
    dispatch(requestTopics())
    fetch(`http://api.vissights.net/v2/dblp/topics`)
      .then((response) => response.json())
      .then((json) => {
          dispatch(receiveTopics(json))
        })
      .catch(error => {
        dispatch(errorTopics())
      })
    }
}
