import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { NotebookStore } from '../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { jsonTreeMonokaiTheme } from './../../theme/Themes'
import { toastr } from 'react-redux-toastr'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { connect } from 'react-redux'
import Vega, { createClassFromSpec } from 'react-vega'
import * as miserables_data from './../spl/vega/data/miserables'
import * as miserables_specs from './../spl/vega/specs/miserables'

const MAX_LENGTH = 20

export type IClusterState = {
  overview: Result<KuberResponse>
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class ClusterUsageStatus extends React.Component<any, any> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  private kuberApi: KuberApi
  private method: string

  miserables_data_nodes_links = {
    'node-data': miserables_data.default.nodes,
    'link-data': miserables_data.default.links
  }

  state = {
    overview: {}
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
              <Vega
                data={this.miserables_data_nodes_links}
                spec={miserables_specs.default}
                />
            </div>
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
    this.kuberApi = window['KuberApi']
    this.getOverview()
  }

  private getOverview() {
    this.kuberApi.getOverview().then(json => { this.setState({overview: json})})
  }

}
