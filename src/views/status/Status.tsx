import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import K8SClusterUsage from './../cluster/K8SClusterUsage'
import ReservationsStatus from './../reservations/ReservationsStatus'
import RunningStatus from './../run/RunningStatus'
import HDFStatus from './../hdfs/HDFSStatus'
import SparkStatus from './../spark/SparkStatus'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../network/NetworkStatus'
import K8SClusterStatus from './../cluster/K8SClusterStatus'
import AwsStatus from './../aws/AwsStatus'
import Apps from './../apps/AppsStatus'
import SpitfireApi from './../../api/spitfire/SpitfireApi'
import KuberApi from './../../api/kuber/KuberApi'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Status extends React.Component<any, any> {
  private spitfireApi: SpitfireApi
  private kuberApi: KuberApi

  public constructor(props) {
    super(props)
    this.spitfireApi = window['SpitfireApi']
    this.kuberApi = window['KuberApi']
  }

  public render() {
    return (
      <div>
        <div className="ms-font-su">Platform Status</div>
        <Pivot>
          <PivotItem linkText='Kubernetes Cluster' itemIcon='Health'>
            <K8SClusterStatus />
          </PivotItem>
          <PivotItem linkText='Cluster Reservations' itemIcon='Clock'>
            <div className="ms-font-xxl">Cluster Reservations</div>
            <ReservationsStatus />
          </PivotItem>
          <PivotItem linkText='Cluster Usage' itemIcon='TFVCLogo'>
            <div className="ms-font-xxl">Cluster Usage</div>
            <K8SClusterUsage />
          </PivotItem>
          <PivotItem linkText='AWS Cloud' itemIcon='Cloud'>
            <AwsStatus />
          </PivotItem>
{/*
          <PivotItem linkText='HDFS' itemIcon='OfflineStorageSolid'>
            <div className="ms-font-xxl">HDFS</div>
            <HDFStatus />
          </PivotItem>
*/}
          <PivotItem linkText='Spark' itemIcon='LightningBolt'>
            <div className="ms-font-xxl">Spark</div>
            <SparkStatus />
          </PivotItem>
          <PivotItem linkText='Running Paragraphs' itemIcon='Running'>
            <div className="ms-font-xxl">Running Paragraphs</div>
            <RunningStatus />
          </PivotItem>
          <PivotItem linkText='Interpreters' itemIcon='Light'>
            <div className="ms-font-xxl">Interpreters</div>
            <SpitfireInterpretersStatus />
          </PivotItem>
          <PivotItem linkText='Network' itemIcon='NetworkTower'>
            <div className="ms-font-xxl">Network Status</div>
            <NetworkStatus
              kuberHealthy={this.kuberApi.state.webSocketHealthy}
              spitfireHealthy={this.spitfireApi.state.webSocketHealthy}
              />
          </PivotItem>
{/*
          <PivotItem linkText='Apps' itemIcon='MapPin'>
            <div className="ms-font-xxl">Applications Status</div>
            <AppsStatus />
          </PivotItem>
*/}
        </Pivot>
      </div>
    )
  }

}
