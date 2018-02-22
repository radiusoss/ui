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
    var persistentVolumes = ''
    if (definition && definition.result) {
      nodes = definition.result.nodeList.nodes.map((node) => {
        return <div className="ms-Grid-row" style={{padding: 0}} key={node.objectMeta.name}>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div className="ms-fontSize-l">{node.objectMeta.name}</div>
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
              <JSONTree 
                data={node.objectMeta.labels}
                theme={json_theme_monokai}
                invertTheme={false}
                hideRoot={true}
                sortObjectKeys={true}
                shouldExpandNode={(keyName, data, level) => true}
                />
            </div>
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
              <JSONTree 
                data={node.allocatedResources} 
                theme={json_theme_monokai}
                invertTheme={false}
                hideRoot={true}
                sortObjectKeys={true}
                shouldExpandNode={(keyName, data, level) => true}
                />
            </div>
          </div>
        </div>
      })
      persistentVolumes = definition.result.persistentVolumeList.items.map((item) => {
        return <div className="ms-Grid-row" style={{padding: 0}} key={item.claim}>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div className="ms-fontSize-l">{item.claim}</div>
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div className="ms-fontSize-l">{item.capacity.storage}</div>
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <div className="ms-fontSize-l">{item.status}</div>
          </div>
        </div>
      })
    }
    return (
      <div>
        <div className="ms-font-xxl">Cluster</div>
        <hr/>
        <div className="ms-font-xl">Nodes</div>
        <div className="ms-Grid" style={{padding: 0}}>
          {nodes}
        </div>
        <hr/>
        <div className="ms-font-xl">Persistent Volumes</div>
        <div className="ms-Grid" style={{padding: 0}}>
          {persistentVolumes}
        </div>
        <hr/>
        <div className="ms-font-xl">Complete Definition</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
                <JSONTree
                  data={definition} 
                  theme={json_theme_monokai}
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
    this.getClusterDef()
  }

  private getClusterDef() {
    this.k8sApi.getClusterDef().then(json => { this.setState({definition: json})})
  }

}
