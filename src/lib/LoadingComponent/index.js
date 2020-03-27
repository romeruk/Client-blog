import React from 'react'
import { Spinner } from "react-bootstrap";

export const LoadingComponent = () => {
  return (
    <div id='overlay'>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  )
}

export default LoadingComponent
