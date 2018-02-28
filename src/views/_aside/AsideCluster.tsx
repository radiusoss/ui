import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import MockContent from './../message/MockContent'
import K8SClusterStatus from './../cluster/K8SClusterStatus'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class AsideCluster extends React.Component<any, any> {

  public constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
      </div>
   )
  }

}
