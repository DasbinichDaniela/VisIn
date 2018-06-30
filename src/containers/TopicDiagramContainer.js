import React, { Component } from 'react'
import { connect } from 'react-redux'
import TopicDiagram from '../components/TopicDiagram'


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
  // var coAuthorArray = [];
  // // var searchedAuthor = state.general.searchString;
  // var searchedAuthor = "Kawa Nazemi";
  // var data = state.general.publications
  //
  // data.forEach(function (publication) {
  //   publication.author.forEach(function(author){
  //     if(author === searchedAuthor){
  //       return true;
  //     }
  //     var authorExistsInCoAutorArray = false;
  //     coAuthorArray.forEach(function(coAuthor){
  //       if(author === coAuthor.name){
  //         coAuthor.count += 1
  //         authorExistsInCoAutorArray = true;
  //       }
  //     });
  //     if(!authorExistsInCoAutorArray){
  //       coAuthorArray.push({"name": author, "count": 1})
  //     }
  //   });
  // });
  var data = state.general.publications;
  var topicData = state.topicsDiagram.topics;
  var annualTopics = [];
  var TOPIC_MIN_RELEVANCE = 0.2
  // var searchedAuthor = "Jens Wissmann"
  data.forEach(function (publication) {
  // include try and catch as some data do not have year infromtion
    try {
      var year = parseInt(publication.year[0])
      // var topics = Object.keys(publication.topics)
      for (var index in publication.topics){
        if(publication.topics[index]>TOPIC_MIN_RELEVANCE){
          var topic = index
          annualTopics.push({"year": year, "topic": topic})
        }
      }
    }
    catch (error) {
      console.log("error in publication", publication)
      // debugger;
      return;
    }
  });

  return {
    topicData: topicData,
    annualTopics: annualTopics,
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(TopicDiagram)
