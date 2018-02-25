import * as React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NetworkStatus extends React.Component<any, any> {

  state = {
    kuberHealthy: false,
    spitfireHealth: false
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { kuberHealthy, spitfireHealth } = this.state
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <hr/>
            <div className="ms-font-l">Kuber</div>
            <div className="ms-Grid" style={{ padding: 0 }}>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
                  <div style={{
                    fontSize: "50px",
                    height: "50px",
                    width: "50px",
                    margin: "0 0px"
                  }}>
                  {
                  (kuberHealthy) && <Icon 
                    iconName='PlugConnected'
                    className="ms-fontColor-tealLight"
                    />
                  }
                  {
                  (!kuberHealthy) && <Icon 
                    iconName='PlugDisconnected'
                    className="ms-fontColor-red"
                    />
                  }
                  </div>
                </div>
              </div>
            </div>
            <hr/>
            <div className="ms-font-l">Spitfire</div>
            <div className="ms-Grid" style={{ padding: 0 }}>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
                <div style={{
                    fontSize: "50px",
                    height: "50px",
                    width: "50px",
                    margin: "0 0px"
                  }}>
                  {
                  (spitfireHealth) && <Icon 
                    iconName='PlugConnected'
                    className="ms-fontColor-tealLight"
                    />
                  }
                  {
                  (!spitfireHealth) && <Icon 
                    iconName='PlugDisconnected'
                    className="ms-fontColor-red"
                    />
                  }
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
