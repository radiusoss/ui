import * as React from 'react'
import ClusterHealthWidget from './ClusterHealthWidget'

export default class ClusterHealth extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <ClusterHealthWidget/>
            </div>
          </div>
        </div>

    </div>
    )
  }

}
