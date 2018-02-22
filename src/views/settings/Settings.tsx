import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import KuberConfig from './../config/KuberConfig'
import HDFSCapacity from './../hdfs/HDFSCapacity'
import ClusterCapacity from './../cluster/ClusterCapacity'
import SpitfireConfig from './../spitfire/SpitfireConfig'
import SpitfireInterpreters from './../spitfire/SpitfireInterpreters'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Settings extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <div className="ms-font-su">Platform Settings</div>
        <Pivot>
        <PivotItem linkText='Cluster Capacity' itemIcon='CircleHalfFull'>
            <div className="ms-font-xxl">Cluster Capacity</div>
            <ClusterCapacity />
          </PivotItem>
          <PivotItem linkText='HDFS Capacity' itemIcon='OfflineStorageSolid'>
            <div className="ms-font-xxl">HDFS Capacity</div>
            <HDFSCapacity />
          </PivotItem>
          <PivotItem linkText='Kuber Config' itemIcon='Equalizer'>
            <KuberConfig />
          </PivotItem>
          <PivotItem linkText='Spitfire Config' itemIcon='Airplane'>
            <SpitfireConfig />
          </PivotItem>
          <PivotItem linkText='Spitfire Interpreters' itemIcon='AirplaneSolid'>
            <SpitfireInterpreters />
          </PivotItem>
          </Pivot>
      </div>
    )
  }

}
