import * as React from 'react'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import HDFSCapacity from './HDFSCapacity'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class HDFSStatus extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <HDFSCapacity/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
