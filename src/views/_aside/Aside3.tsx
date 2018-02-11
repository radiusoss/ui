import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import MockContent from './../message/MockContent'
import ClusterStatus from './../cluster/ClusterStatus'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Aside3 extends React.Component<any, any> {

  public constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <MockContent/>
        <ClusterStatus/>
      </div>
   )
  }

}
