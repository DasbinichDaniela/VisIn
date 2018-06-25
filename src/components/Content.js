import React from 'react'

const Content = ({publications}) => (
  <ul>
    {publications.map((publication, i) =>
      <li key={i}>{publication.title}</li>
    )}
  </ul>
)

export default Content
