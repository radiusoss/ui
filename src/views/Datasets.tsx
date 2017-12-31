import * as React from 'react'
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot';
import Datalake from './dataset/Datalake'
import HBase from './dataset/HBase'
import Hive from './dataset/Hive'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Datasets extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <Pivot>
          <PivotItem linkText='Datalake' itemIcon='AzureLogo'>
            <Datalake/>
          </PivotItem>
          <PivotItem linkText='HBase' itemIcon='AzureLogo'>
            <HBase/>
          </PivotItem>
          <PivotItem linkText='Hive' itemIcon='AzureLogo'>
            <Hive/>
          </PivotItem>
        </Pivot>
      </div>
    )
  }

}
