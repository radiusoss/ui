import * as React from 'react'
import NotebookApi from './../../api/notebook/NotebookApi'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Datalake extends React.Component<any, any> {
  private notebookApi: NotebookApi

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    return (
      <div>
        Datalake
      </div>
    )
  }

}
