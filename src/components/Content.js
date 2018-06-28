import React from 'react'

const Content = ({publications, isLoading}) => (
  <div>
    {isLoading &&
      <h1>Please stay calm!</h1>
    }
    <ul>
      {publications.map((publication, i) =>
        <li key={i}>{publication.title}</li>
      )}
    </ul>
  </div>
)

export default Content
