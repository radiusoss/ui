import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { jsonTreeMonokaiTheme } from './../../theme/Themes'
import JSONTree from 'react-json-tree'
import ConfigApi from '../../api/config/ConfigApi'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

export type IAwsStatusState = {
  instances: any
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class AwsStatus extends React.Component<any, IAwsStatusState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  state = {
    instances: {
      Reservations: []
    }
  }
/*
  state = {
    instances: {
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
  }

  public render() {
    var out: any[] = []
    const { instances } = this.state
    var numberOfAwsInstances = 0
    if (this.state != null) {
      if (instances.Reservations && instances.Reservations.length > 0) {
        out = instances.Reservations.map(instances => {
          return instances.Instances.map(instance => {
            console.log('---', instance)
            numberOfAwsInstances++
            return <div className="ms-Grid-row" style={{padding: 0}} key={instance.InstanceId}>
              <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">
                <div className="ms-fontSize-l">Name: {instance.InstanceId}</div>
              </div>
              <div className="ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3">
                <div className="ms-fontSize-l">Public Hostname: {instance.PublicDnsName}</div>
                <div><br/></div>
                <div className="ms-fontSize-l">Public IP: {instance.PublicIpAddress}</div>
              </div>
              <div className="ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3">
                <div className="ms-fontSize-l">Launch Time: {instance.LaunchTime}</div>
                <div><br/></div>
                <div className="ms-fontSize-l">Status: {instance.State.Name.toUpperCase()}</div>
              </div>
              <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
                <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
                  <JSONTree 
                    data={instance.Tags} 
                    theme={jsonTreeMonokaiTheme}
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
        <div className="ms-fontSize-su">{numberOfAwsInstances} AWS Instances</div>
        <div className="ms-fontSize-xxl">Ensure you have enough AWS instances to host the Kubernetes Master and Workers.</div>
        <hr/>
        <div className="ms-Grid" style={{padding: 0}}>
          {out}
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.restClient.get<{}>({}, jsonOpt, "/eu-central-1/instances")
      .then(json => { this.setState({instances: json})})
  }

}
