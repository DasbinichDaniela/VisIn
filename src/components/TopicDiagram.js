import React, { Component } from 'react'
import './TopicDiagram.css'
// import './App.css'
// import { scaleLinear } from 'd3-scale'
// import { max } from 'd3-array'
// import { select } from 'd3-selection'

import * as d3 from "d3"


class TopicDiagram extends Component {
  constructor(props){
    super(props)
    this.createTopicDiagram = this.createTopicDiagram.bind(this)
  }
  componentDidMount() {
    this.createTopicDiagram()
  }
  componentDidUpdate() {
    // this.createTopicDiagram()
  }

  createTopicDiagram() {

    var settings = {
        minDate: 0,
        maxDate: 0,
        intervalCount: 0,
        numberOfTicks: 0,
        rangeXStart: 100,
        rangeXEnd: 800,
        highestCount: 0,
        topicIndexName: [],
        topicNames: [],
        annualTopics: this.props.annualTopics,
        intervalYearsArray: [],
        positionXArray: [],
        topicSequence: [],
        finalArray: [],
        diagramHeight: 0,
        colores: ["#0B132B", "#70A896", "#BA3939", "#1C2541", "#3A506B", "#B8D8D9", "#81B29A", "#757575", "#B8C679", "#EAEAEA", "#E2856E", "#2B0E10", "#950D25", "#8D0D30", "#4D4D60"],
      }

    createScale(settings, this.xAxis)
    this.getIntervalsForXAxis(settings)
    this.addIntervalsToTopicList(settings)
    this.deleteDuplicatesAnnualTopics(settings)
    // Define Topics, Sequence, Colors and Y Values.
    this.defineTopicSequence(settings)
    this.addColorsForEachTopic(settings)
    this.addYValueForEachTopic(settings)
    this.addTopicSequenceDataToAnnualTopics(settings)
    this.addXValueToAnnualTopics(settings)
    this.addRadiusToAnnualTopics(settings)
    settings.finalArray = settings.annualTopics
    console.log(settings.finalArray)
    settings.topicNameList = getTopicNames(this.props.topicData, settings)
    this.calculateHeightOfDiagram(settings)
    this.createCircles(settings, this.chart)

    function getTopicNames(topicData, settings){
      var topicNameList = [];
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
        topicNameList.push(topic)
      }
      for(var indexList in topicNameList){
        for(var indexFinalArray in settings.finalArray){
          if(topicNameList[indexList].id == settings.finalArray[indexFinalArray].topic){
            topicNameList[indexList].y = settings.finalArray[indexFinalArray].y
            break;
          }
        }
      }
      return topicNameList
    }

  function createScale(settings, xAxis){
    var svg = d3.select(xAxis).append("svg")
                        .attr("width", 1000)
                        .attr("height", 100);

    var minMaxDate = calculateMinMax(settings.annualTopics);

    settings.minDate = minMaxDate[0];
    settings.maxDate = minMaxDate[1];

    getAxisSpecs(settings)

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

  function getAxisSpecs(settings){
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

  function calculateMinMax(annualTopics){
    annualTopics.sort(function(a,b){
      return a.year - b.year
    });
    var minMaxDate = [annualTopics[0].year, annualTopics[annualTopics.length-1].year+1]
    return minMaxDate
  }
};

  // height and widht should adjust according to how many topics are included
  // just calculate and multiply needed size by topics
  createCircles(settings, chart){
    var svgContainer = d3.select(chart).append("svg")
      .attr("width", 1000)
      .attr("height", settings.diagramHeight)
      .append("g")

    var div = d3.select(chart).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var circles = svgContainer.selectAll("circle")
                              .data(settings.annualTopics)
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


    var circleAttributes = circles
                            .attr("cx", function (d){return d.x;})
                            .attr("cy", function (d){return d.y;})
                            .attr("r", function (d){return d.r;})
                            .style("fill", function(d){return d.color;
                            })

    var text = svgContainer.selectAll("text")
                          .data(settings.topicNameList)
                          .enter()
                          .append("text");

    var textLabels = text
                      .attr("x", 800)
                      .attr("y", function (d){return d.y;})
                      .text(function(d){return d.name})
  }

  getIntervalsForXAxis(settings){
    // create Intervals instead of Years to get position in time axis
    var timeDif = settings.maxDate - settings.minDate;
    var index = 0;

    for(index; index < timeDif/settings.intervalCount; index++){
      var intervalYears = [];
      var i = 0;
      for(i; i<settings.intervalCount; i++){
        intervalYears.push(settings.minDate)
        settings.minDate+=1
      }
      // array which show years per interval
      settings.intervalYearsArray.push(intervalYears)
    }
    // get x Valus by the position of the center of intervals on x Axis
    // positionX is an Array with the final positions for the circle in the Interval
    var distanceX = (settings.rangeXEnd-settings.rangeXStart)/(timeDif/settings.intervalCount);
    var index = 0;
    var positionX = [];
    var setX = settings.rangeXStart+distanceX/2;
    for(index; index < settings.intervalYearsArray.length; index++){
      if(settings.positionXArray.length == 0){
        // start range for X neets to be set at first possible line.
        settings.positionXArray.push(setX)
      } else {
        setX+=distanceX
        settings.positionXArray.push(setX)
      }
    }
  }

  addIntervalsToTopicList(settings){
    // change year of topic into interval of topic
    var annualTopicList = [];
    for(var index in settings.annualTopics){
      var intervalYear = 0;
      var year = settings.annualTopics[index].year
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
      topic.topic = settings.annualTopics[index].topic
      annualTopicList.push(topic)
    }
    settings.annualTopics = annualTopicList;
  }

  deleteDuplicatesAnnualTopics(settings){
    // get uniqueAnnualTopicList - by reducing objects that contain the same values (same topic in the same interval)
    var duplicateAnnualTopicListString = settings.annualTopics.map(object => JSON.stringify(object))
    var uniqueAnnualTopicList = [];
    new Set(duplicateAnnualTopicListString).forEach(string => uniqueAnnualTopicList.push(JSON.parse(string)))
    uniqueAnnualTopicList.forEach((uniqueAnnualTopic) => {
      uniqueAnnualTopic.count = 0
      settings.annualTopics.forEach(function(duplicateAnnualTopic){
        if (uniqueAnnualTopic.interval == duplicateAnnualTopic.interval && uniqueAnnualTopic.topic == duplicateAnnualTopic.topic){
          uniqueAnnualTopic.count = uniqueAnnualTopic.count + 1
         }
      });
    });
    settings.annualTopics = uniqueAnnualTopicList
  }

  defineTopicSequence(settings){
    // to get an array in a sequence where the most important topic gets the highest y-Value
    // looks in settings.annualTopics for a topic: if topic is available count topics
    settings.annualTopics.forEach(function(topicInformation) {
        var topicExistsInTopicSequence = false;
        settings.topicSequence.forEach(function(topicNewList){
          if(topicInformation.topic === topicNewList.topic){
            topicNewList.count += topicInformation.count
            topicExistsInTopicSequence = true;
          }
        });
        if(!topicExistsInTopicSequence){
          settings.topicSequence.push({"topic": topicInformation.topic, "count": topicInformation.count})
          }
      });
      settings.topicSequence.sort(function(a, b){
        return b.count - a.count;
      });
      settings.highestCount = settings.topicSequence[0].count;
      // get Array with topic names according to topic positions/Sequence
      for(var index in settings.topicSequence){
        settings.topicNames.push(settings.topicSequence[index].topic)
      }
  }

  addColorsForEachTopic(settings){
    // getColor a different color for each topic (max 20 colours; afterwards they will repeat)
    var indexColor = 0;
    var index = 0;
    for(index in settings.topicSequence){
      settings.topicSequence[index].color = settings.colores[indexColor];
      if(indexColor != settings.colores.length){
        indexColor+=1
      } else {
        indexColor = 0
      }
    }
  }

  addYValueForEachTopic(settings){
    // get Y values according to index position of topic in topicSequence
    // The first (last count) topic gets the lowest value 20; then higher up with 20 steps()
    var index = 0;
    for(index in settings.topicSequence){
      var y = index*80+80
      settings.topicSequence[index].y = y
    }
  }

  addTopicSequenceDataToAnnualTopics(settings){
      // add y Values and colors to each object in settings.annualTopics according to value of topic
    var index = 0;
    settings.annualTopics.map((topicInformation) => {
      for(index in settings.annualTopics){
        settings.topicSequence.forEach(function(topic){
          if(settings.annualTopics[index].topic == topic.topic){
            var topicInformation = settings.annualTopics[index]
            topicInformation.y = topic.y
            topicInformation.color = topic.color
            return topicInformation
          }
        });
      }
    });
  }

  // For each Object define X Value according to center of Interval
  addXValueToAnnualTopics(settings){
      for(var index in settings.annualTopics){
      var intervalNumber = settings.annualTopics[index].interval-1;
      settings.annualTopics[index].x = settings.positionXArray[intervalNumber]
    }
  }

  addRadiusToAnnualTopics(settings){
    var maxValue = 0;
    for(var index in settings.annualTopics){
      if(settings.annualTopics[index].count>maxValue){
        maxValue = settings.annualTopics[index].count
      }
    }
    var minRadius = 5;
    var maxRadius = 40;
    var RadiusDif = 35/maxValue
    for(var index in settings.annualTopics){
      var radius = settings.annualTopics[index].count*RadiusDif+5
      settings.annualTopics[index].r = radius
    }
  }

  calculateHeightOfDiagram(settings){
    for(var index in settings.annualTopics){
      if(settings.diagramHeight<settings.annualTopics[index].y){
        settings.diagramHeight = settings.annualTopics[index].y + 40
      }
    }
  }

  render() {
    return (
      <div className="topicDiagram">
        <div id="topicChart" ref={node => this.chart = node}></div>
        <div ref={node => this.xAxis = node}></div>
      </div>
    )
  }
}
export default TopicDiagram
