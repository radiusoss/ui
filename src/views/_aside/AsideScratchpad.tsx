import * as React from 'react'
import { connect, redux } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

export type IAside2State = {
    wsMessages: any[]
}

const MAX_LENGTH = 20

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class AsideScratchpad extends React.Component<any, IAside2State> {

  state = {
    wsMessages: new Array()
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    return (    
      <div>
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
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (webSocketMessageReceived.op) {
//      console.log("Web Socket Message Received", webSocketMessageReceived)
      var msg = this.state.wsMessages
      if (msg.length > MAX_LENGTH) {
          msg = msg.slice(0, MAX_LENGTH - 1)
      }
      msg.unshift(webSocketMessageReceived)
      this.setState({
        wsMessages: msg
      })
    }
  }

}
