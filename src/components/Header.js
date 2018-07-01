import React from 'react'
import { connect } from 'react-redux'
import { startSearch } from '../actions'
import './Header.css'

const Header = ({ dispatch }) => {
  let input

  return (
    <div className="header">
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(startSearch(input.value))
        // input.value = ''
      }}>
        <input ref={node => input = node} placeholder="Search..."/>
        <button type="submit">
          Search
        </button>
      </form>
    </div>
  )
}

export default connect()(Header)
