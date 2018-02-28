import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import KuberConfig from './../config/KuberConfig'
import HDFSCapacity from './../hdfs/HDFSCapacity'
import CloudStatus from './../cloud/CloudStatus'
import SpitfireConfig from './../spitfire/SpitfireConfig'
import SpitfireInterpretersConfig from './../spitfire/SpitfireInterpretersConfig'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Settings extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <div className="ms-font-su">Platform Settings</div>
        <Pivot>
        <PivotItem linkText='Cloud Capacity' itemIcon='Cloud'>
            <div className="ms-fontSize-su">Cloud K8S</div>
            <CloudStatus />
          </PivotItem>
{/*
          <PivotItem linkText='HDFS Capacity' itemIcon='OfflineStorageSolid'>
            <div className="ms-fontSize-su">HDFS Capacity</div>
            <HDFSCapacity />
          </PivotItem>
*/}
          <PivotItem linkText='Kuber Config' itemIcon='Equalizer'>
            <div className="ms-fontSize-su">Kuber Config</div>
            <KuberConfig />
          </PivotItem>
          <PivotItem linkText='Spitfire Config' itemIcon='Airplane'>
            <div className="ms-fontSize-su">Spitfire Configuration</div>
            <SpitfireConfig />
          </PivotItem>
          <PivotItem linkText='Spitfire Interpreters' itemIcon='AirplaneSolid'>
            <div className="ms-fontSize-su">Spitfire Interpreters Configuration</div>
            <SpitfireInterpretersConfig />
          </PivotItem>
          </Pivot>
      </div>
    )
  }

}
