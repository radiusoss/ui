import * as React from 'react'
import { NotebookStore } from './../../store/NotebookStore'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class K8SClusterHealth extends React.Component<any, any> {
  private kuberApi: KuberApi

  state = {
    cluster: null,
    cpuUsed: -1,
    cpuTotal: -1,
    cpuPercentage: -1,
    cpuClassName: 'bg-info',
    memoryUsed: -1,
    memoryTotal: -1,
    memoryPercentage: -1,
    memoryClassName: 'bg-info',
    podUsed: -1,
    podTotal: -1,
    podPercentage: -1,
    podClassName: 'bg-info'
  }

  public constructor(props) {
    super(props)
  }
    
  public render() {
    const {
      cpuUsed, cpuTotal, cpuPercentage, cpuClassName, 
      memoryUsed, memoryTotal, memoryPercentage, memoryClassName,
      podUsed, podTotal, podPercentage, podClassName
    } = this.state
    return (
      <div>
        <div className="text-uppercase mb-q mt-2">
          <small><b>CPU</b></small>
        </div>
        <div className="progress progress-xs">
          <div className={`progress-bar ${cpuClassName}`} role="progressbar" style={{ "width": `${cpuPercentage}%`}} aria-valuenow={cpuPercentage} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">{cpuUsed / 1000} Requested / {cpuTotal / 1000} Available.</small>
        <div className="text-uppercase mb-q mt-h">
          <small><b>Memory</b></small>
        </div>
        <div className="progress progress-xs">
          <div className={`progress-bar ${memoryClassName}`} role="progressbar" style={{ "width": `${memoryPercentage}%`}} aria-valuenow={memoryPercentage} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">{memoryUsed / 1000000000} GB Requested / {memoryTotal / 1000000000} GB Available.</small>
        <div className="text-uppercase mb-q mt-h">
          <small><b>Pods</b></small>
        </div>
        <div className="progress progress-xs">
          <div className={`progress-bar ${podClassName}`} role="progressbar" style={{ "width": `${podPercentage}%`}} aria-valuenow={podPercentage} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">{podUsed} Requested / {podTotal} Available.</small>
      </div>
    )
  }

  public componentDidMount() {
    this.kuberApi = window['KuberApi']
    this.kuberApi.status()
    this.kuberApi.getClusterDef().then(json => { this.setState({definition: json})})
  }

  public componentWillReceiveProps(nextProps) {
    const { kuberMessageReceived } = nextProps
    if (kuberMessageReceived) {
      if (kuberMessageReceived.op == "KUBER_STATUS") {        
        this.kuberApi.getClusterDef()
          .then(cluster => {
            this.updateCluster(cluster)
          })
      }
    }
  }

/*
  cpuCapacity:16000
  cpuRequests:6380
  memoryCapacity:31606943744
  memoryRequests:13631488000
  podCapacity:110
  allocatedPods:17
*/
  private updateCluster(cluster) {

    var cpuUsed=0, cpuTotal=0, cpuPercentage=0, cpuClassName='', 
      memoryUsed=0, memoryTotal=0, memoryPercentage=0, memoryClassName='',
      podUsed=0, podTotal=0, podPercentage=0, podClassName=''

    if (cluster.result) {
      cluster.result.nodeList.nodes.map(n => {
        var ar = n.allocatedResources
        cpuUsed += ar.cpuRequests
        cpuTotal += ar.cpuCapacity
        memoryUsed += ar.memoryRequests
        memoryTotal += ar.memoryCapacity
        podUsed += ar.allocatedPods
        podTotal += ar.podCapacity
      })
    }

    cpuPercentage = cpuUsed / cpuTotal * 100
    cpuClassName = this.toClassName(cpuPercentage)

    memoryPercentage = memoryUsed / memoryTotal * 100
    memoryClassName = this.toClassName(memoryPercentage)

    podPercentage = podUsed / podTotal * 100
    podClassName = this.toClassName(podPercentage)

    this.setState({
      cluster: cluster,
      cpuUsed: cpuUsed,
      cpuTotal: cpuTotal,
      cpuPercentage: cpuPercentage,
      cpuClassName: cpuClassName,
      memoryUsed: memoryUsed,
      memoryTotal: memoryTotal,
      memoryPercentage: memoryPercentage,
      memoryClassName: memoryClassName,
      podUsed: podUsed,
      podTotal: podTotal,
      podPercentage: podPercentage,
      podClassName: podClassName
    })

  }

  /*
  bg-info
  bg-success
  bg-warning
  bg-danger
  */
  private toClassName(percentage) {
    if (percentage < 40) return 'bg-success'
    if (percentage < 75) return 'bg-warning'
    if (percentage < 100) return 'bg-danger'
    return 'bg-info'
  }

}
