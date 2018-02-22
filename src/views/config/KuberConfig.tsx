import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { NotebookStore } from '../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
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

  state = {
    config: NotebookStore.state().config
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
    const { config } = this.state
    var out = Object.keys(config).map((k) => {
      return <div className="ms-Grid-row" key={k}>
        <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
          <div className="ms-fontSize-l ms-fontWeight-semibold">{k}</div>
        </div>
        <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
        <div className="ms-fontSize-l">{config[k]}</div>
        </div>
      </div>
    })
    return (
      <div>
        <div className="ms-font-xxl">Kuber Config</div>
        <div className="ms-Grid">
          {out}
        </div>
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { config, kuberMessageReceived } = nextProps
    if (config && ! isEqual(config, this.state.config)) {
      this.setState({config: config})
    }    
  }

}
