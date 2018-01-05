import * as React from 'react'
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import Microsoft from './profile/Microsoft'
import Kerberos from './profile/Kerberos'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Profile extends React.Component<any, any> {

  public constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <Pivot>
          <PivotItem linkText='Microsoft' itemIcon='AzureLogo'>
            <Microsoft />
          </PivotItem>
{/*
          <PivotItem linkText='Kerberos' itemIcon='SecurityGroup'>
            <Kerberos />
          </PivotItem>
*/}
        </Pivot>
      </div>
    )
  }

}
