import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import Cluster from './../cluster/Cluster'
import Aws from './../cloud/aws/Aws'
import Apps from './../apps/Apps'
import Config from './../config/Config'
import SpitfireConfig from './../spitfire/Config'
import SpitfireInterpreters from './../spitfire/Interpreters'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Settings extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <Pivot>
          <PivotItem linkText='Configuration' itemIcon='ConfigurationSolid'>
            <Config />
          </PivotItem>
          <PivotItem linkText='Cluster' itemIcon='World'>
            <Cluster />
          </PivotItem>
{/*
          <PivotItem linkText='AWS' itemIcon='Cloud'>
            <Aws />
          </PivotItem>
*/}
          <PivotItem linkText='Spitfire Config' itemIcon='Airplane'>
            <SpitfireConfig />
          </PivotItem>
          <PivotItem linkText='Spitfire Interpreters' itemIcon='AirplaneSolid'>
            <SpitfireInterpreters />
          </PivotItem>
          <PivotItem linkText='Apps' itemIcon='MapPin'>
            <Apps />
          </PivotItem>
        </Pivot>
      </div>
    )
  }

}
