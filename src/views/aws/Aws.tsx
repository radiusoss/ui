import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import ConfigApi from '../../api/config/ConfigApi'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

export type IAwsState = {
  config: IConfig
  volumes: any
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Aws extends React.Component<any, IAwsState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  private configApi: ConfigApi
  private k8sApi: KuberApi

  state = {
    config: emptyConfig,
    volumes: {}
  } 

  public constructor(props) {    
    super(props)
  }

  public render() {
    return (
      <div>
        <div className="ms-font-xxl">Amazon AWS</div>
          <div style={{ padding: "10px", backgroundColor: "black" }}>
            <JSONTree 
              data={this.state.volumes} 
              theme='greenscreen'
              invertTheme={false}
            />
          </div>
      </div>
    )

  }

  public componentDidMount() {
    this.configApi = window['ConfigApi'] 
    this.k8sApi = window['KuberApi']
    this.restClient = new RestClient({
      name: 'KuberRestAws',
      url: this.config.kuberRest,
      path: '/kuber/api/v1/cloud/aws'
    })
    this.setState({
      config: this.configApi.getConfig()
    })
    this.restClient.get<{}>({}, jsonOpt, "/eu-central-1/volumes")
      .then(json => { this.setState({volumes: json})})
  }

}
