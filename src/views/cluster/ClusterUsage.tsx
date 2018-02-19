import * as React from 'react'
import { connect } from 'react-redux'
import NotYetAvailable from './../message/NotYetAvailable'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ClusterUsage extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <div className="ms-font-xxl">Cluster Usage</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <NotYetAvailable/>
{/*
TODO(ECH) Current Capacity (Current number of nodes in visual way)
*/}
            </div>
          </div>
        </div>
      </div>
    )
  }

}
