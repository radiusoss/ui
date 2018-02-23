import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import ClusterUsage from './../cluster/ClusterUsage'
import ClusterReservations from './../cluster/ClusterReservations'
import JobsStatus from './../jobs/JobsStatus'
import HDFStatus from './../hdfs/HDFSStatus'
import SparkStatus from './../spark/SparkStatus'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../network/NetworkStatus'
import ClusterStatus from './../cluster/ClusterStatus'
import AwsStatus from './../aws/AwsStatus'
import Apps from './../apps/Apps'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Status extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <div className="ms-font-su">Platform Status</div>
        <Pivot>
          <PivotItem linkText='Cluster' itemIcon='Health'>
            <ClusterStatus />
          </PivotItem>
          <PivotItem linkText='Usage' itemIcon='TFVCLogo'>
            <div className="ms-font-xxl">Cluster Usage</div>
            <ClusterUsage />
          </PivotItem>
          <PivotItem linkText='Reservations' itemIcon='Clock'>
            <div className="ms-font-xxl">Upcoming Cluster Reservations</div>
            <ClusterReservations />
          </PivotItem>
          <PivotItem linkText='Amazon AWS' itemIcon='Cloud'>
            <AwsStatus />
          </PivotItem>
          <PivotItem linkText='HDFS' itemIcon='OfflineStorageSolid'>
            <div className="ms-font-xxl">HDFS Status</div>
            <HDFStatus />
          </PivotItem>
          <PivotItem linkText='Interpreters' itemIcon='Light'>
            <div className="ms-font-xxl">Spitfire Interpreters</div>
            <SpitfireInterpretersStatus />
          </PivotItem>
          <PivotItem linkText='Spark' itemIcon='LightningBolt'>
            <div className="ms-font-xxl">Spark</div>
            <SparkStatus />
          </PivotItem>
          <PivotItem linkText='Jobs' itemIcon='Clock'>
            <div className="ms-font-xxl">Jobs</div>
            <JobsStatus />
          </PivotItem>
          <PivotItem linkText='Network' itemIcon='NetworkTower'>
            <div className="ms-font-xxl">Network Status</div>
            <NetworkStatus />
          </PivotItem>
{/*
          <PivotItem linkText='Apps' itemIcon='MapPin'>
            <div className="ms-font-xxl">Applications Status</div>
            <Apps />
          </PivotItem>
*/}
        </Pivot>
      </div>
    )
  }

}
