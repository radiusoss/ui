import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot';
import Cluster from './cluster/Cluster'
import Aws from './cloud/aws/Aws'
import Helm from './helm/Helm'
import Config from './config/Config'
import SpitfireConfig from './spitfire/Config'
import SpitfireInterpreters from './spitfire/Interpreters'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Settings extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <Pivot>
          <PivotItem linkText='Configuration' itemIcon='Settings'>
            <Config />
          </PivotItem>
          <PivotItem linkText='Kubernetes' itemIcon='AdminCLogoInverse32'>
            <Cluster />
          </PivotItem>
          <PivotItem linkText='Helm' itemIcon='Headset'>
            <Helm />
          </PivotItem>
          <PivotItem linkText='AWS' itemIcon='Cloud'>
            <Aws />
          </PivotItem>
          <PivotItem linkText='Spitfire' itemIcon='Airplane'>
            <SpitfireConfig />
          </PivotItem>
          <PivotItem linkText='Interpreters' itemIcon='TransitionPop'>
            <SpitfireInterpreters />
          </PivotItem>
        </Pivot>
      </div>
    )
  }

}
