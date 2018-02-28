import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { jsonTreeMonokaiTheme } from './../../theme/Themes'
import { toastr } from 'react-redux-toastr'
import K8SClusterHealth from './K8SClusterHealth'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

const MAX_LENGTH = 20

export type IClusterState = {
  definition: Result<KuberResponse>
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class K8SClusterStatus extends React.Component<any, IClusterState> {
  private config: IConfig = NotebookStore.state().config
  private kuberApi: KuberApi

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
    var numberOfNodes = 0
    var numberOfPersistentVolumes = 0
    if (definition && definition.result) {
      nodes = definition.result.nodeList.nodes.map((node) => {
        numberOfNodes++
        return <div className="ms-Grid-row" style={{padding: 0}} key={node.objectMeta.name}>
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <div className="ms-fontSize-xxl">Node {node.objectMeta.name}</div>
          </div>
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
              <JSONTree
                data={node.objectMeta.labels}
                theme={jsonTreeMonokaiTheme}
                invertTheme={false}
                hideRoot={true}
                sortObjectKeys={true}
                shouldExpandNode={(keyName, data, level) => true}
                />
            </div>
            <br/>
          </div>
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
              <JSONTree 
                data={node.allocatedResources} 
                theme={jsonTreeMonokaiTheme}
                invertTheme={false}
                hideRoot={true}
                sortObjectKeys={true}
                shouldExpandNode={(keyName, data, level) => true}
                />
            </div>
            <br/>
          </div>
        </div>
      })
      persistentVolumes = definition.result.persistentVolumeList.items.map((item) => {
        numberOfPersistentVolumes++
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
        <div className="ms-Grid" style={{padding: 0}}>
          <div className="ms-Grid-row" style={{padding: 0}}>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div className="ms-fontSize-su">{numberOfNodes} Kubernetes Nodes</div>
              <div className="ms-fontSize-xxl">The Kubernetes Nodes host the Kubernetes Master and the Workers.</div>
            </div>
          </div> 
          <K8SClusterHealth/>
          <hr/>
          {nodes}
        </div>
        <hr/>
        <div className="ms-Grid" style={{padding: 0}}>
          <div className="ms-Grid-row" style={{padding: 0}}>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div className="ms-fontSize-su">{numberOfPersistentVolumes} Persistent Volumes</div>
            </div>
          </div> 
          {persistentVolumes}
        </div>
        <hr/>
        <div className="ms-fontSize-su">Complete Definition</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
                <JSONTree
                  data={definition} 
                  theme={jsonTreeMonokaiTheme}
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
    this.getClusterDef()
  }

  private getClusterDef() {
    this.kuberApi.getClusterDef().then(json => { this.setState({definition: json})})
  }

}
