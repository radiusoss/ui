import * as React from 'react'
import { connect, redux } from 'react-redux'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { NotebookStore } from './../../store/NotebookStore'
import NotebookApi from './../../api/notebook/NotebookApi'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

export type IAsideScratchpadState = {
    wsMessages: any[],
    interpreterSettings: any[]
}

const MAX_MESSAGE_RECEIVED_LENGTH = 20

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class AsideScratchpad extends React.Component<any, IAsideScratchpadState> {
  private notebookApi: NotebookApi

  state = {
    wsMessages: new Array(),
    interpreterSettings: new Array()
  }

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
        <div className="callout m-0 py-h text-muted text-center bg-faded text-uppercase">
          <small><b>Received Messages</b></small>
        </div>
        {
          this.state.wsMessages.map((w) => {
            return (
              <small key={ Math.random() } className="text-muted">
                { JSON.stringify(w) }
                <br/>
              </small>
            )
          })
        }
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
*/}
        </div>
    )
  }

  public async componentDidMount() {
    this.loadInterpreterSettings()
  }

  public componentWillReceiveProps(nextProps) {
    /*
        const { webSocketMessageReceived } = nextProps
        if (webSocketMessageReceived.op) {
          var msg = this.state.wsMessages
          if (msg.length > MAX_MESSAGE_RECEIVED_LENGTH) {
            msg = msg.slice(0, MAX_MESSAGE_RECEIVED_LENGTH - 1)
          }
          msg.unshift(webSocketMessageReceived)
          this.setState({
            wsMessages: msg
          })
        }
    */
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
