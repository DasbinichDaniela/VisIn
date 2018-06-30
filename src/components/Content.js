import React from 'react'
import CoAuthorDiagramContainer from '../containers/CoAuthorDiagramContainer'
import TopicDiagramContainer from '../containers/TopicDiagramContainer'
import './Content.css'

const Content = ({publications, isLoading, errorConnection, noInformationFound, topics}) => (
  <div>
    {isLoading &&
      <h1>Please stay calm!</h1>
    }
    {errorConnection &&
      <h1>Please check your connection!</h1>
    }
    {noInformationFound &&
      <h1>There is no author with that name! Please try again.</h1>
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
