import React, { Component } from 'react'
import { connect } from 'react-redux'
import Content from '../components/Content'


const mapStateToProps = state => {
  let publications;
  if(state.general && state.general.publications){
    publications = state.general.publications
  } else {
    publications = []
  }
  return {
    startScreen: state.general.startScreen,
    publications: publications,
    isLoading: state.general.isLoading,
    errorConnection: state.general.errorConnection,
    noInformationFound: state.general.noInformationFound,
    topics: state.topicsDiagram.topics,
  }
}

export default connect(
  mapStateToProps,
)(Content)
