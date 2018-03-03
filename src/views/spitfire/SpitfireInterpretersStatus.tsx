import * as React from 'react'
import { connect } from 'react-redux'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import NotebookApi from './../../api/notebook/NotebookApi'
import JSONTree from 'react-json-tree'
import { jsonTreeMonokaiTheme } from './../../theme/Themes'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class InterpretersStatus extends React.Component<any, any> {
  private notebookApi: NotebookApi

  public constructor(props) {
    super(props)
    this.state = {
      interpreterSettings: {}
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-row">
              <CommandButton iconProps={ { iconName: 'Sync' } } onClick={ (e => this.restartInterpreters(e))} >Restart Interpreters</CommandButton>
            </div>
{/*
            <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
              <JSONTree
                data={this.state.interpreterSettings} 
                theme={jsonTreeMonokaiTheme}
                invertTheme={false}
                hideRoot={true}
                sortObjectKeys={true}
                shouldExpandNode={(keyName, data, level) => true}
                />
              </div>
*/}
          </div>
        </div>
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
