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
  return {
    publications: publications,
    isLoading: state.general.isLoading,
    errorConnection: state.general.errorConnection,
    noInformationFound: state.general.noInformationFound,
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(Content)
