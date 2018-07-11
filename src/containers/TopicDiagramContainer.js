import React, { Component } from 'react'
import { connect } from 'react-redux'
import TopicDiagram from '../components/TopicDiagram'


// get Topic Information and bring it into the right form to use it in TopicDiagram
const mapStateToProps = state => {
  var data = state.general.publications;
  var topicData = state.topicsDiagram.topics;
  var annualTopics = [];
  var TOPIC_MIN_RELEVANCE = 0.2
  data.forEach(function (publication) {
  // include try and catch as some data do not have year information
    try {
      var year = parseInt(publication.year[0])
      for (var index in publication.topics){
        if(publication.topics[index]>TOPIC_MIN_RELEVANCE){
          var topic = index
          annualTopics.push({"year": year, "topic": topic})
        }
      }
    }
    catch (error) {
      console.log("error in publication", publication)
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
)(TopicDiagram)
