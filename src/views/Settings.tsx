import * as React from 'react'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot';
import Interpreters from './settings/Interpreters'
import Configuration from './settings/Configuration'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Settings extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <Pivot>
          <PivotItem linkText='Interpreters' itemIcon='Equalizer'>
            <Interpreters/>
          </PivotItem>
          <PivotItem linkText='Configuration' itemIcon='Repair'>
            <Configuration/>
          </PivotItem>
        </Pivot>
      </div>
    )
  }

}
