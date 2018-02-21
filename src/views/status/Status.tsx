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
            <ClusterCapacity />
          </PivotItem>
          <PivotItem linkText='Usage' itemIcon='Frigid'>
            <ClusterUsage />
          </PivotItem>
          <PivotItem linkText='Health' itemIcon='Health'>
            <ClusterHealth />
          </PivotItem>
          <PivotItem linkText='Reservations' itemIcon='Calendar'>
            <ClusterReservations />
          </PivotItem>
          <PivotItem linkText='HDFS' itemIcon='OfflineStorageSolid'>
            <HDFStatus />
          </PivotItem>
          <PivotItem linkText='Interpreters' itemIcon='Light'>
            <SpitfireInterpretersStatus />
          </PivotItem>
          <PivotItem linkText='Spark REPL' itemIcon='EngineeringGroup'>
            <SparkStatus />
          </PivotItem>
          <PivotItem linkText='Network' itemIcon='NetworkTower'>
            <NetworkStatus />
          </PivotItem>
        </Pivot>
      </div>
    )
  }

}
