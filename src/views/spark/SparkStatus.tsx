import * as React from 'react'
import { connect } from 'react-redux'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import NotebookApi from './../../api/notebook/NotebookApi'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SparkStatus extends React.Component<any, any> {
  private notebookApi: NotebookApi

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    return (
      <div>
        <hr/>
        <div className="ms-font-l">Executors</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
        <hr/>
        <div className="ms-font-l">Variables</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
        <hr/>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <CommandButton iconProps={ { iconName: 'Sync' } } onClick={ (e => this.restartInterpreters(e))} >Restart Spark</CommandButton>
            </div>
          </div>
        </div>
{/*
        <div className="ms-font-l">Jobs</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
        <hr/>
        <div className="ms-font-l">UI</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            </div>
          </div>
        </div>
*/}
      </div>
    )
  }

  public async componentDidMount() {
    this.loadInterpreterSettings()
  }

  private async loadInterpreterSettings() {
    var interpreterSettings = this.notebookApi.interpreterSetting()
     .then(s => {
      this.setState({
        interpreterSettings: s
      })
    })
  }

  private async restartInterpreters(e) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.restartInterpreters()
    this.loadInterpreterSettings()
  }

}
