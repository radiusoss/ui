import * as React from 'react'
import { connect } from 'react-redux'
import NotYetAvailable from './../message/NotYetAvailable'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SparkUI extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <div className="ms-font-xxl">Spark UI</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <NotYetAvailable/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
