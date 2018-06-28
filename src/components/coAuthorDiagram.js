import React from 'react'

const Content = ({publications, isLoading, errorConnection, noInformationFound}) => (
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
    <ul>
      {publications.map((publication, i) =>
        <li key={i}>{publication.title}</li>
      )}
    </ul>
  </div>
)

export default Content
