import React, { Component } from 'react'
import { connect } from 'react-redux'
import CoAuthorDiagram from '../components/CoAuthorDiagram'


const mapStateToProps = state => {
  var coAuthorArray = [];
  var searchedAuthor = state.general.searchString;
  var data = state.general.publications

  data.forEach(function (publication) {
    publication.author.forEach(function(author){
      if(author.toLowerCase() === searchedAuthor.toLowerCase()){
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
)(CoAuthorDiagram)
