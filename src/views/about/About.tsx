import * as React from 'react'
import Highlights from './Highlights'

export default class About extends React.Component<any, any> {

  public render() {

    return (
      <div>
{/*
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
              <h1>Kuber Board</h1>
              <h2>Collect. Explore. Model. Serve.</h2>
              <br/>
              <br/>
            </div>
          </div>
        </div>
*/}
        <Highlights showAll="true" />
      </div>
    )

  }

}
