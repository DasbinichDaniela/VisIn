import React from 'react'
import { connect } from 'react-redux'
import { startSearch } from '../actions'
import './Header.css'

const Header = ({ dispatch }) => {
  let input

  return (
    <div className="header">
      <img id="VisIn_Logo" src={require("../assets/VisIn_Logo.png")} />
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(startSearch(input.value))
      }}>
        <input ref={node => input = node} placeholder="Search..."/>
        <button id="searchButton" type="submit">
          <img id="searchImage" src={require("../assets/magnifying-glass.svg")} />
        </button>
      </form>
    </div>
  )
}

export default connect()(Header)
  // <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
