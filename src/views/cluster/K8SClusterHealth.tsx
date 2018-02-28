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
    cpuUsed: -1,
    cpuTotal: -1,
    cpuPercentage: -1,
    cpuClassName: 'bg-info',
    memoryUsed: -1,
    memoryTotal: -1,
    memoryPercentage: -1,
    memoryClassName: 'bg-info'
  }

  public constructor(props) {
    super(props)
  }
    
  public render() {
    const { cpuUsed, cpuTotal, cpuPercentage, cpuClassName, memoryUsed, memoryTotal, memoryPercentage,  memoryClassName } = this.state
    return (
      <div>
        <div className="text-uppercase mb-q mt-2">
          <small><b>Cluster CPU Usage</b></small>
        </div>
        <div className="progress progress-xs">
          <div className={`progress-bar ${cpuClassName}`} role="progressbar" style={{ "width": `${cpuPercentage}%`}} aria-valuenow="{xxx}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">{cpuUsed} Used / {cpuTotal} Available.</small>
        <div className="text-uppercase mb-q mt-h">
          <small><b>Cluster Memory Usage</b></small>
        </div>
        <div className="progress progress-xs">
          <div className={`progress-bar ${memoryClassName}`} role="progressbar" style={{ "width": `${memoryPercentage}}%`}} aria-valuenow="{xxx}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">{memoryUsed} Used / {memoryTotal} Available.</small>
{/*
        <div className="text-uppercase mb-q mt-h">
          <small><b>Disk Usage</b></small>
        </div>
        <div className="progress progress-xs">
          <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "95%" }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">243GB/256GB</small>
*/}
{/*
        <h6>Settings</h6>
        <div className="aside-options">
            <div className="clearfix mt-2">
                <small><b>Option 1</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox" defaultChecked/>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
            <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
            </div>
        </div>
        <div className="aside-options">
            <div className="clearfix mt-1">
                <small><b>Option 2</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox"></input>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
            <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
            </div>
        </div>
        <div className="aside-options">
            <div className="clearfix mt-1">
                <small><b>Option 3</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox"></input>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
        </div>
        <div className="aside-options">
            <div className="clearfix mt-1">
                <small><b>Option 4</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox" defaultChecked></input>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
        </div>
        <hr/>
*/}
    </div>
    )
  }

  public componentDidMount() {
    this.kuberApi = window['KuberApi']
    this.kuberApi.status()
  }

  public componentWillReceiveProps(nextProps) {
    const { kuberMessageReceived } = nextProps
    if (kuberMessageReceived) {
      if (kuberMessageReceived.op == "KUBER_STATUS") {
        this.updateWithStatus(kuberMessageReceived)
      }
    }
  }

/*
    bg-info
    bg-success
    bg-warning
    bg-danger
*/
  private updateWithStatus(status) {
    if (status.cluster) {
      this.setState({
      })
    }
    else {
      this.setState({
      })
    }
  }

}
