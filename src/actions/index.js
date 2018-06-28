export const REQUEST_SEARCH = 'REQUEST_SEARCH'
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH'

export const requestSearch = searchString => ({
  type: REQUEST_SEARCH,
  searchString
  // searchString: searchString
})

export const receiveSearch = (searchString, json) => ({
  type: RECEIVE_SEARCH,
  searchString,
  publications: json.data.children.map(child => child.data)
})

export const startSearch = (searchString) => {
  return (dispatch) => {
    dispatch(requestSearch(searchString))
    fetch(`https://www.reddit.com/r/${searchString}.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveSearch(searchString, json)))
  }
}
