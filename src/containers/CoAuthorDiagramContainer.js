import React, { Component } from 'react'
import { connect } from 'react-redux'
import CoAuthorDiagram from '../components/CoAuthorDiagram'


const mapStateToProps = state => {

  // ich breche den globalen State auf die jeweiligen props runter
  // meine props sind das was nachher returned wird
  // let publications;
  // if(state.general && state.general.publications){
  //   publications = state.general.publications
  // } else {
  //   publications = []
  // }
  // return {
  //   publications: publications,
  //   isLoading: state.general.isLoading,
  //   errorConnection: state.general.errorConnection,
  //   noInformationFound: state.general.noInformationFound,
  // }
  var coAuthorArray = [];
  var searchedAuthor = state.general.searchString;
  // var searchedAuthor = "Kawa Nazemi";
  var data = state.general.publications

  data.forEach(function (publication) {
    publication.author.forEach(function(author){
      if(author === searchedAuthor){
        return true;
      }
      var authorExistsInCoAutorArray = false;
      coAuthorArray.forEach(function(coAuthor){
        if(author === coAuthor.name){
          coAuthor.count += 1
          authorExistsInCoAutorArray = true;
        }
      });
      if(!authorExistsInCoAutorArray){
        coAuthorArray.push({"name": author, "count": 1})
      }
    });
  });

  return {
    coAuthorArray: coAuthorArray,
    searchedAuthor: searchedAuthor,
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(CoAuthorDiagram)
