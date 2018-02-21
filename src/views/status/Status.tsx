import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import ClusterCapacity from './../cluster/ClusterCapacity'
import ClusterUsage from './../cluster/ClusterUsage'
import ClusterHealth from './../cluster/ClusterHealth'
import ClusterReservations from './../cluster/ClusterReservations'
import HDFStatus from './../hdfs/HDFSStatus'
import SparkStatus from './../spark/SparkStatus'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../network/NetworkStatus'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Status extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <div className="ms-font-su">Platform Status</div>
        <Pivot>
          <PivotItem linkText='Capacity' itemIcon='CircleFill'>
            <div className="ms-font-xxl">Cluster Capacity</div>
            <ClusterCapacity />
          </PivotItem>
          <PivotItem linkText='Usage' itemIcon='Frigid'>
            <div className="ms-font-xxl">Cluster Usage</div>
            <ClusterUsage />
          </PivotItem>
          <PivotItem linkText='Health' itemIcon='Health'>
            <div className="ms-font-xxl">Cluster Health</div>
            <ClusterHealth />
          </PivotItem>
          <PivotItem linkText='Reservations' itemIcon='Calendar'>
            <div className="ms-font-xxl">Cluster Reservations</div>
            <ClusterReservations />
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
          <PivotItem linkText='Network' itemIcon='NetworkTower'>
            <div className="ms-font-xxl">Network Status</div>
            <NetworkStatus />
          </PivotItem>
        </Pivot>
      </div>
    )
  }

}
