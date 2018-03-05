import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import K8SClusterTopology from './../cluster/K8SClusterTopology'
import ReservationsStatus from './../reservations/ReservationsStatus'
import RunningStatus from './../run/RunningStatus'
import HDFStatus from './../hdfs/HDFSStatus'
import SparkStatus from './../spark/SparkStatus'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../network/NetworkStatus'
import K8SClusterStatus from './../cluster/K8SClusterStatus'
import AWSInstances from './../aws/AWSInstances'
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
          <PivotItem linkText='Kubernetes' itemIcon='Health'>
            <K8SClusterStatus />
          </PivotItem>
          <PivotItem linkText='Cluster Reservations' itemIcon='Clock'>
            <div className="ms-fontSize-su">Cluster Reservations</div>
            <ReservationsStatus />
          </PivotItem>
          <PivotItem linkText='Cluster Usage' itemIcon='TFVCLogo'>
            <div className="ms-fontSize-su">Cluster Usage</div>
            <K8SClusterTopology />
          </PivotItem>
          <PivotItem linkText='AWS Instances' itemIcon='Cloud'>
            <AWSInstances />
          </PivotItem>
          <PivotItem linkText='HDFS' itemIcon='OfflineStorageSolid'>
            <div className="ms-fontSize-su">HDFS</div>
            <HDFStatus />
          </PivotItem>
          <PivotItem linkText='Spark' itemIcon='LightningBolt'>
            <div className="ms-fontSize-su">Spark</div>
            <SparkStatus />
          </PivotItem>
          <PivotItem linkText='Running Paragraphs' itemIcon='Running'>
            <div className="ms-fontSize-su">Running Paragraphs</div>
            <RunningStatus />
          </PivotItem>
          <PivotItem linkText='Interpreters' itemIcon='Light'>
            <div className="ms-fontSize-su">Interpreters</div>
            <SpitfireInterpretersStatus />
          </PivotItem>
          <PivotItem linkText='Network' itemIcon='NetworkTower'>
            <div className="ms-fontSize-su">Network Status</div>
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
