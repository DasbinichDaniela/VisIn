import React, { Component } from 'react'
import './TopicDiagram.css'
import * as d3 from "d3"


class TopicDiagram extends Component {
  componentDidMount() {
    this.createTopicDiagram()
  }

  createTopicDiagram() {
    // define settings so it can be easily transferred and updated through functions
    var settings = {
        diagramHeight: 0,
        minDate: 0,
        maxDate: 0,
        intervalCount: 0,
        numberOfTicks: 0,
        originalArrayTopics: this.props.annualTopics,
        authorsTopicList: this.props.annualTopics,
        intervalYearsArray: [],
        positionXArray: [],
        topicListOrdered: [],
        topicNames: [],
        topicNameList: [],
        colors: ["#0B132B", "#70A896", "#BA3939", "#1C2541", "#3A506B", "#B8D8D9", "#81B29A", "#757575", "#B8C679", "#EAEAEA", "#E2856E", "#2B0E10", "#950D25", "#8D0D30", "#4D4D60"],
      }

    this.calculateMinMaxDate(settings)
    this.calculateSpecsForXAxis(settings)
    this.calculateIntervalsForXAxis(settings)
    this.createXAxis(settings, this.xAxis)

    this.addIntervalsToAuthorsTopicList(settings)
    this.deleteDuplicatesInAuthorsTopicList(settings)
    // Define Topics, Sequence, Colors and Y Values.
    this.defineTopicSequence(settings)
    this.addColorsForEachTopic(settings)
    this.addYValueForEachTopic(settings)
    this.addTopicSequenceDataToAuthorsTopicList(settings)
    this.addXValueToAuthorsTopicList(settings)
    this.addRadiusToAuthorsTopicList(settings)
    this.createListOfTopicNames(this.props.topicData, settings)
    this.addYValueForTopicNames(this.props.topicData, settings)
    // settings.topicNameList = addYValueForTopicNames(this.props.topicData, settings)
    this.calculateHeightOfDiagram(settings)
    this.createCircles(settings, this.chart)

};

  createCircles(settings, chart){
    // select svg and create new group element
    var svgContainer = d3.select(chart).append("svg")
      .attr("width", 1000)
      .attr("height", settings.diagramHeight)
      .append("g")

    // define div for tooltip
    var div = d3.select(chart).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // create circles with tooltip function
    var circles = svgContainer.selectAll("circle")
                              .data(settings.authorsTopicList)
                              .enter()
                              .append("circle")
                              .on("mouseover", function(d) {
                                div.transition()
                                  .duration(200)
                                  .style("opacity", .8);
                                div.html(d.count)
                                  .style("left", (d3.event.pageX) + "px")
                                  .style("top", (d3.event.pageY) + "px");
                              })
                              .on("mouseout", function(d) {
                                  div.transition()
                                      .duration(500)
                                      .style("opacity", 0);
                              })

    // add circle attributes
    var circleAttributes = circles
                            .attr("cx", function (d){
                              return d.x;
                            })
                            .attr("cy", function (d){return d.y;})
                            .attr("r", function (d){return d.r;})
                            .style("fill", function(d){return d.color;
                            })


    // add topic Names to Y Axis and position
    var text = svgContainer.selectAll("text")
                          .data(settings.topicNameList)
                          .enter()
                          .append("text");

    var textLabels = text
                      .attr("x", 800)
                      .attr("y", function (d){return d.y;})
                      .text(function(d){return d.name})
  }

  calculateIntervalsForXAxis(settings){
    // create Intervals instead of Years to get position in time axis
    var timeDif = settings.maxDate - settings.minDate;
    var minDate = settings.minDate
    var index = 0;

    for(index; index < timeDif/settings.intervalCount; index++){
      var intervalYears = [];
      var i = 0;

      for(i; i<settings.intervalCount; i++){
        intervalYears.push(minDate)
        minDate+=1
      }
      // array which shows years per interval
      settings.intervalYearsArray.push(intervalYears)
    }
    // get x Values: position shall be in the center of intervals on x Axis
    // positionX is an Array with the final positions for the circle in each interval
    var rangeXStart = 100;
    var rangeXEnd = 800;
    var distanceX = (rangeXEnd-rangeXStart)/(timeDif/settings.intervalCount);
    var index = 0;
    var positionX = [];
    var setX = rangeXStart+distanceX/2;
    for(index; index < settings.intervalYearsArray.length; index++){
      if(settings.positionXArray.length == 0){
        // start range for X needs to be set at first possible position
        settings.positionXArray.push(setX)
      } else {
        setX+=distanceX
        settings.positionXArray.push(setX)
      }
    }
  }

  addIntervalsToAuthorsTopicList(settings){
    // change year of topic in authorsTopicList into interval of topic
    var annualTopicList = [];
    for(var index in settings.authorsTopicList){
      var intervalYear = 0;
      var year = settings.authorsTopicList[index].year
      var i = 0;
      for(i in settings.intervalYearsArray){
        if(year == settings.intervalYearsArray[i]){
          intervalYear = Number(i)+1;
        }else{
          for(var j in settings.intervalYearsArray[i]){
            if(year == settings.intervalYearsArray[i][j]){
              intervalYear = Number(i)+1;
            }
          }
        }
      }
      var topic = {};
      topic.interval = intervalYear;
      topic.topic = settings.authorsTopicList[index].topic
      annualTopicList.push(topic)
    }
    // change array with year and topic to interval and topic
    settings.authorsTopicList = annualTopicList;
  }

  deleteDuplicatesInAuthorsTopicList(settings){
    // get uniqueAnnualTopicList - by reducing objects that contain the same values (same topic in the same interval)
    var duplicateAnnualTopicListString = settings.authorsTopicList.map(object => JSON.stringify(object))
    new Set(duplicateAnnualTopicListString).forEach(string => settings.authorsTopicList.push(JSON.parse(string)))
    settings.authorsTopicList.forEach((uniqueAnnualTopic) => {
      uniqueAnnualTopic.count = 0
      settings.authorsTopicList.forEach(function(duplicateAnnualTopic){
        if (uniqueAnnualTopic.interval == duplicateAnnualTopic.interval && uniqueAnnualTopic.topic == duplicateAnnualTopic.topic){
          uniqueAnnualTopic.count = uniqueAnnualTopic.count + 1
         }
      });
    });
  }

  defineTopicSequence(settings){
    // to get an array in a sequence where the most important topic gets the highest y-Value
    // looks in settings.authorsTopicList for a topic: if topic is available count topics
    settings.authorsTopicList.forEach(function(topicInformation) {
        var topicExistsInTopicSequence = false;
        settings.topicListOrdered.forEach(function(topicNewList){
          if(topicInformation.topic === topicNewList.topic){
            topicNewList.count += topicInformation.count
            topicExistsInTopicSequence = true;
          }
        });
        if(!topicExistsInTopicSequence){
          settings.topicListOrdered.push({"topic": topicInformation.topic, "count": topicInformation.count})
          }
      });
      settings.topicListOrdered.sort(function(a, b){
        return b.count - a.count;
      });
      // get Array with topic names according to topic positions/Sequence
      for(var index in settings.topicListOrdered){
        settings.topicNames.push(settings.topicListOrdered[index].topic)
      }
  }

  addColorsForEachTopic(settings){
    // get a different color for each topic (max 20 colours; afterwards they will repeat)
    var indexColor = 0;
    var index = 0;
    for(index in settings.topicListOrdered){
      settings.topicListOrdered[index].color = settings.colors[indexColor];
      if(indexColor != settings.colors.length){
        indexColor+=1
      } else {
        indexColor = 0
      }
    }
  }

  addYValueForEachTopic(settings){
    // get Y values according to index position of topic in topicListOrdered
    // The first (last count) topic gets the lowest value 20; then higher up with 20 steps()
    var index = 0;
    for(index in settings.topicListOrdered){
      var y = index*80+80
      settings.topicListOrdered[index].y = y
    }
  }

  addTopicSequenceDataToAuthorsTopicList(settings){
      // add y Values and colors to each object in settings.authorsTopicList according to value of topic
    var index = 0;
    settings.authorsTopicList.map((topicInformation) => {
      for(index in settings.authorsTopicList){
        settings.topicListOrdered.forEach(function(topic){
          if(settings.authorsTopicList[index].topic == topic.topic){
            var topicInformation = settings.authorsTopicList[index]
            topicInformation.y = topic.y
            topicInformation.color = topic.color
            return topicInformation
          }
        });
      }
    });
  }

  // For each Object define X Value according to center of Interval
  addXValueToAuthorsTopicList(settings){
    for(var index in settings.authorsTopicList){
      var intervalNumber = settings.authorsTopicList[index].interval-1;
      settings.authorsTopicList[index].x = settings.positionXArray[intervalNumber]
    }
  }

  addRadiusToAuthorsTopicList(settings){
    // get radius according - according to normalization
    var maxValue = 0;
    for(var index in settings.authorsTopicList){
      if(settings.authorsTopicList[index].count>maxValue){
        maxValue = settings.authorsTopicList[index].count
      }
    }
    var minRadius = 5;
    var maxRadius = 40;
    var RadiusDif = 35/maxValue
    for(var index in settings.authorsTopicList){
      var radius = settings.authorsTopicList[index].count*RadiusDif+minRadius
      settings.authorsTopicList[index].r = radius
    }
  }

  calculateHeightOfDiagram(settings){
    // set Diagram height to be able to show all the available topics
    for(var index in settings.authorsTopicList){
      if(settings.diagramHeight<settings.authorsTopicList[index].y){
        settings.diagramHeight = settings.authorsTopicList[index].y + 40
      }
    }
  }

  createListOfTopicNames(topicData, settings){
    // use phrases as they are more clear about the topic
    // If phrases get too long, use the words instead for topic names
    for(var index in settings.topicNames){
      var indexNumberTopic = settings.topicNames[index]
      var topicString = null;
      if(topicData[indexNumberTopic].phrase[0][0].length<40){
        topicString = topicData[indexNumberTopic].phrase[0][0]
      }else {
        topicString = topicData[indexNumberTopic].word[0][0]
      }

      var topic = {};
      topic.id = indexNumberTopic
      topic.name = topicString
      settings.topicNameList.push(topic)
    }
  }

  addYValueForTopicNames(topicData, settings){
    // define position of topics accordint to relevance of topic
    for(var index in settings.topicNameList){
      for(var indexFinalArray in settings.authorsTopicList){
        if(settings.topicNameList[index].id == settings.authorsTopicList[indexFinalArray].topic){
          settings.topicNameList[index].y = settings.authorsTopicList[indexFinalArray].y
          break;
        }
      }
    }
  }

  calculateMinMaxDate(settings){
    // calculate min and max Date for time scale
    settings.originalArrayTopics.sort(function(a,b){
      return a.year - b.year
    });
    settings.minDate = settings.originalArrayTopics[0].year;
    settings.maxDate = settings.originalArrayTopics[settings.originalArrayTopics.length-1].year+1;
  }

  createXAxis(settings, xAxis){
    // create x Axis with min and max Date
    var svg = d3.select(xAxis).append("svg")
                        .attr("width", 1000)
                        .attr("height", 100);

    var axisScale = d3.scaleTime()
          .domain([new Date(settings.minDate, 0, 1), new Date(settings.maxDate, 0, 1)])
          .range([100, 800]);

    var xAxis = d3.axisBottom()
      .scale(axisScale)
      .ticks(settings.numberOfTicks)
      .tickSize(10)
      .tickFormat(d3.timeFormat("%Y"));

      // transform sets scale y pixel downwards
      var xAxisGroup = svg.append("g")
          .attr("transform", "translate(0, 50)")
          .call(xAxis);
    }

    calculateSpecsForXAxis(settings){
      // Define aggregation of Years to create Intervals
      var difTime = settings.maxDate-settings.minDate+1
      var aggregationNumber = 1
      if((difTime)<1){
        settings.numberOfTicks = difTime
        settings.intervalCount = 1;
      }
      else {
        var aggregationArray = [2, 5, 10, 20, 50, 100]
        var count = null;
        for (var index in aggregationArray){
          var count = Math.ceil(difTime/aggregationArray[index])
          if (count<10){
            console.log(aggregationNumber)
            settings.numberOfTicks = count
            aggregationNumber = aggregationArray[index]
            settings.intervalCount = aggregationNumber
            break;
          }
        }
      }
        // new min and max date for better/more intuitiv count on axis
      settings.minDate = Math.floor(settings.minDate/aggregationNumber)*aggregationNumber
      settings.maxDate = Math.ceil(settings.maxDate/aggregationNumber)*aggregationNumber
    }


  render() {
    return (
      <div id="topicDiagramContainer">
        <div id="topicChart" ref={node => this.chart = node}></div>
        <div ref={node => this.xAxis = node}></div>
      </div>
    )
  }
}
export default TopicDiagram
