import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { json_theme_monokai } from './../../theme/Themes'
import { toastr } from 'react-redux-toastr'
import ClusterHealth from './ClusterHealth'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

const MAX_LENGTH = 20

export type IClusterState = {
  overview: Result<KuberResponse>
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class ClusterUsage extends React.Component<any, IClusterState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  private k8sApi: KuberApi
  private method: string

  state = {
    overview: null
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
                <JSONTree
                  data={this.state.overview} 
                  invertTheme={false}
                  hideRoot={true}
                  sortObjectKeys={true}
                  shouldExpandNode={(keyName, data, level) => true}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
  }

  public componentDidMount() {
    this.k8sApi = window['KuberApi']
    this.getOverview()
  }

  private getOverview() {
    this.k8sApi.getOverview().then(json => { this.setState({overview: json})})
  }

}
