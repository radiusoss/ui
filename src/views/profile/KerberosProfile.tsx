import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class KerberosProfile extends React.Component<any, any> {

  public render() {
    return (
      <div>Kerberos</div>
    )
  }
}
