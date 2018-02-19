import * as React from 'react'
import { connect } from 'react-redux'
import { Slider } from 'office-ui-fabric-react/lib/Slider'
import NotYetAvailable from './../message/NotYetAvailable'
import { toastr } from 'react-redux-toastr'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ClusterCapacity extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <div className="ms-font-xxl">Cluster Capacity</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <NotYetAvailable/>
            </div>
          </div>
          <div className="ms-Grid-row" style={{ maxWidth: "500px" }}>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Slider
                label='Number of Workers'
                min={ 0 }
                max={ 3 }
                step={ 1 }
                defaultValue={ 0 }
                showValue={ true }
                disabled={ false }
                onChange={ (value) => toastr.warning('Not yet available', 'Wait the new version to get ' + value + ' worker(s).') }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

}
