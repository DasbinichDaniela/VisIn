import React, { Component } from 'react'
import { connect } from 'react-redux'
import CoAuthorDiagram from '../components/CoAuthorDiagram'

// get data from coAuthorARray and bring it into the right form to use for diagrams
const mapStateToProps = state => {
  var coAuthorArray = [];
  var searchedAuthor = state.general.searchString;
  var data = state.general.publications

  data.forEach(function (publication) {
    if(!publication.author) return false; // go to next publication
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
