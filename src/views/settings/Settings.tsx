import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import KuberConfig from './../config/KuberConfig'
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
