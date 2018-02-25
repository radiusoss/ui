import * as React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NetworkStatus extends React.Component<any, any> {

  public constructor(props) {
    super(props)
    this.state = {
      kuberHealthy: props.kuberHealthy,
      spitfireHealthy: props.spitfireHealthy
    }
  }

  public render() {
    const { kuberHealthy, spitfireHealthy } = this.state
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <hr/>
              <div className="ms-font-l">Kuber</div>
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              {
              (kuberHealthy) && <Icon 
                iconName='PlugConnected'
                className="ms-fontColor-tealLight"
                style={{
                  fontSize: "50px",
                  height: "50px",
                  width: "50px",
                  margin: "0 10px"
                }}
              />
              }
              {
              (!kuberHealthy) && <Icon 
                iconName='PlugDisconnected'
                className="ms-fontColor-red"
                style={{
                  fontSize: "50px",
                  height: "50px",
                  width: "50px",
                  margin: "0 10px"
                }}
              />
              }
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <hr/>
              <div className="ms-font-l">Spitfire</div>
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              {
              (spitfireHealthy) && <Icon 
                iconName='PlugConnected'
                className="ms-fontColor-tealLight"
                style={{
                  fontSize: "50px",
                  height: "50px",
                  width: "50px",
                  margin: "0 10px"
                }}
                />
              }
              {
              (!spitfireHealthy) && <Icon 
                iconName='PlugDisconnected'
                className="ms-fontColor-red"
                style={{
                  fontSize: "50px",
                  height: "50px",
                  width: "50px",
                  margin: "0 10px"
                }}
              />
              }
              <hr/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
