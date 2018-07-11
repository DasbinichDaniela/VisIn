import React from 'react'
import CoAuthorDiagramContainer from '../containers/CoAuthorDiagramContainer'
import TopicDiagramContainer from '../containers/TopicDiagramContainer'
import './Content.css'


// create different content pages according to state
const Content = ({startScreen, publications, isLoading, errorConnection, noInformationFound, topics}) => (
  <div>
    {startScreen &&
      <div className="startScreen">
        <div id="logo">
          <img id="VisIn_Logo_2" src={require("../assets/VisIn_Logo_2.png")} />
        </div>
        <div className="rect">
          <div id="rectOne"/>
          <div id="rectTwo"/>
          <div id="rectThree"/>
        </div>
      </div>
    }

    {isLoading &&
      <div id="loadingScreen">
        <h1>Please wait, we are loading your information!</h1>
      </div>
    }

    {errorConnection &&
      <div id="errorScreen">
        <h1>There was a server error, please try again later.</h1>
      </div>
    }

    {noInformationFound &&
      <div id="errorScreen">
        <h1>There is no author with that name, please try again.</h1>
      </div>
    }

    <div className='rowComponents'>
      {publications.length>0 &&
        <CoAuthorDiagramContainer />
      }
      {topics.length>0 &&
        <TopicDiagramContainer />
      }
    </div>
  </div>
)

export default Content
