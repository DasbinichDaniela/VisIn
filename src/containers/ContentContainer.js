import React, { Component } from 'react'
import { connect } from 'react-redux'
import Content from '../components/Content'


const mapStateToProps = state => {
  // ich breche den globalen State auf die jeweiligen props runter
  // meine props sind das was nachher returned wird
  let publications;
  if(state.general && state.general.publications){
    publications = state.general.publications
  } else {
    publications = []
  }
  debugger;
  return {
    publications: publications
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(Content)