import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { NotebookStore } from '../../store/NotebookStore'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import KuberApi, { KuberResponse } from '../../api/kuber/KuberApi'

const MAX_LENGTH = 20

export type IKuberState = {
  apps: Result<KuberResponse>
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Apps extends React.Component<any, IKuberState> {
  private config: IConfig = NotebookStore.state().config
  private k8sApi: KuberApi
  private method: string

  state = {
    apps: null
  } 

  public constructor(props) {    
    super(props)
  }

  public render() {
    return (
      <div>
        <div className="ms-font-xxl">Applications</div>
        <div style={{ padding: "10px", backgroundColor: "black" }}>
          <JSONTree 
            data={this.state.apps} 
            theme='greenscreen'
            invertTheme={false}
          />
        </div>
      </div>
    )

  }

  public componentDidMount() {
    this.k8sApi = window['KuberApi']
    this.k8sApi.getApps().then(json => { this.setState({apps: json})})
  }

  public componentWillReceiveProps(nextProps) {
    const { config, kuberMessageReceived } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
  }

}
