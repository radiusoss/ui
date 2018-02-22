import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { toastr } from 'react-redux-toastr'
import ClusterHealth from './ClusterHealth'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

const MAX_LENGTH = 20

export type IClusterState = {
  definition: Result<KuberResponse>
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class ClusterDefinition extends React.Component<any, IClusterState> {
  private config: IConfig = NotebookStore.state().config
  private k8sApi: KuberApi

  state = {
    definition: null
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { definition } = this.state
    var nodes = ''
    if (definition && definition.result) {
      console.log('---', definition)
      nodes = definition.result.nodeList.nodes.map((node) => {
        return <div className="ms-Grid-row" style={{padding: 0}}>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div className="ms-fontSize-l">{node.objectMeta.name}</div>
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div style={{ padding: "10px", backgroundColor: "black" }}>
              <JSONTree 
                data={node.objectMeta.labels} 
                theme='greenscreen'
                invertTheme={false}
              />
            </div>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <div style={{ padding: "10px", backgroundColor: "black" }}>
                <JSONTree 
                  data={node.persisentVolumeList.items} 
                  theme='greenscreen'
                  invertTheme={false}
                />
              </div>
            </div>
          </div>
        </div>
      })
    }
    return (
      <div>
        <div className="ms-font-xxl">Cluster</div>
        <div className="ms-font-xl">Nodes</div>
        <div className="ms-Grid" style={{padding: 0}}>
          {nodes}
        </div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div style={{ padding: "10px", backgroundColor: "black" }}>
                <JSONTree
                  data={this.state.definition} 
                  theme='greenscreen'
                  invertTheme={false}
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
    this.getClusterDef()
  }

  private getClusterDef() {
    this.k8sApi.getClusterDef().then(json => { this.setState({definition: json})})
  }

}
