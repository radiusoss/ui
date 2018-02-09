import * as React from 'react'

export default class Board extends React.Component<any, any> {

  public render() {

    return (
      <div className="ms-Grid ms-fadeIn500">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 text-center">
            <p className="ms-font-xxl">Notebook</p>
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 text-center">
            <p className="ms-font-xxl">Cluster</p>
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 text-center">
            <p className="ms-font-xxl">Calendar</p>
          </div>
        </div>
      </div>
    )

  }

}
