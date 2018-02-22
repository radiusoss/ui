import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { json_theme_monokai } from './../../theme/Themes'
import JSONTree from 'react-json-tree'
import ConfigApi from '../../api/config/ConfigApi'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

export type IAwsStatusState = {
  vms: any
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class AwsStatus extends React.Component<any, IAwsStatusState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
/*
  state = {
    vms: {
      Reservations: [{
        Instances: [{
          InstanceId: '',
          LaunchTime: '',
          PublicDnsName: '',
          PublicIpAddress: '',
          State: {
            Name: ''
          }
        }]
      }]
    }
  } 
*/
  public constructor(props) {    
    super(props)
    this.restClient = new RestClient({
      name: 'KuberRestAwsStatus',
      url: this.config.kuberRest,
      path: '/kuber/api/v1/cloud/aws'
    })
    this.state = null
  }

  public render() {
    var out = <div></div>
    if (this.state != null) {
      const { vms } = this.state
      if (vms.Reservations && vms.Reservations.length > 0) {
        out = vms.Reservations.map(instances => { 
          return instances.Instances.map(instance => {
            console.log('---', instance)
            return <div className="ms-Grid-row" style={{padding: 0}} key={instance.InstanceId}>
              <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">
                <div className="ms-fontSize-l">{instance.InstanceId}</div>
              </div>
              <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">
                <div className="ms-fontSize-l">{instance.PublicDnsName}</div>
                <div><br/></div>
                <div className="ms-fontSize-l">[{instance.PublicIpAddress}]</div>
              </div>
              <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">
                <div className="ms-fontSize-l">{instance.LaunchTime}</div>
              </div>
              <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">
                <div className="ms-fontSize-l">{instance.State.Name.toUpperCase()}</div>
              </div>
              <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
                <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
                  <JSONTree 
                    data={instance.Tags} 
                    theme={json_theme_monokai}
                    invertTheme={false}
                    hideRoot={true}
                    sortObjectKeys={true}
                    shouldExpandNode={(keyName, data, level) => true}
                    />
                </div>
              </div>
              <div className="ms-Grid-row" style={{padding: 0}}>
                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
                  <hr/>
                </div>
              </div>
            </div>
          })
        })
      }
    }
    return (
      <div>
        <div className="ms-font-xl">Virtual Machines</div>
        <div className="ms-Grid" style={{padding: 0}}>
          {out}
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.restClient.get<{}>({}, jsonOpt, "/eu-central-1/vms")
      .then(json => { this.setState({vms: json})})
  }

}
