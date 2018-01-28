import * as React from 'react'
import { Link } from 'react-router-dom'

export default class Simple extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <h1>Simple</h1>
        <ul>
          <li><Link to="/">/</Link></li>
          <li><Link to="/dla/welcome">/dla/welcome</Link></li>
          <li><Link to="/dla/about">/dla/about</Link></li>
          <li><Link to="/simple">/simple</Link></li>
          <li><Link to="/simple/about">/simple/about</Link></li>
          </ul>
      </div>
    )
  }

}
