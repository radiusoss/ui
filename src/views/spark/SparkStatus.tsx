import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SparkStatus extends React.Component<any, any> {
/*
TODO(ECH)
+ List Variables
+ Show Number of Spark Executors
*/
public render() {
    return (
      <div>
        <div className="ms-font-xxl">Spark REPL</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
        <div className="ms-font-xxl">Spark Variables</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
        <div className="ms-font-xxl">Spark Jobs</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
        <div className="ms-font-xxl">Spark UI</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
      </div>
    )
  }

}
