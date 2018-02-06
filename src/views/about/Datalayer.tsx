import * as React from 'react'
import Highlights from './Highlights'

export default class Datalayer extends React.Component<any, any> {

  public render() {

    return (
      <div className="ms-fadeIn500">
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
              <img src="/img/datalayer/datalayer-square-name.png" />
              <p className="ms-font-su">Simple. Collaborative. Multi Cloud. Big Data Science</p>
              <p className="ms-font-su"><a href="http://datalayer.io" target="_blank">http://datalayer.io</a> &copy; 2017-2018</p>
            </div>
          </div>
        </div>
      </div>
    )

  }

}
