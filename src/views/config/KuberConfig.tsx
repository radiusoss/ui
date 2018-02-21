import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { NotebookStore } from '../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import KuberApi from '../../api/kuber/KuberApi'
import ConfigApi from '../../api/config/ConfigApi'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'

export type IKuberState = {
  config: any
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class KuberConfig extends React.Component<any, IKuberState> {
  private k8sApi: KuberApi
  private configApi: ConfigApi
  private config: IConfig = NotebookStore.state().config

  state = {
    config: {}
  } 

  public constructor(props) {    
    super(props)
  }

  public componentDidMount() {
    this.configApi = window['ConfigApi']
    this.k8sApi = window['KuberApi']
    this.setState({
      config: this.configApi.getConfig()
    })
  }

  public render() {
    return (
      <div>
        <div style={{ padding: "10px", backgroundColor: "black" }}>
          <JSONTree 
            data={this.state.config} 
            theme='greenscreen'
            invertTheme={false}
          />
        </div>
      </div>
    )

  }

  public componentWillReceiveProps(nextProps) {
    const { config, kuberMessageReceived } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.setState({config: config})
    }    
  }

}
