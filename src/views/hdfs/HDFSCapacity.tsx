import * as React from 'react'
import NotYetAvailable from './../message/NotYetAvailable'
import { Slider } from 'office-ui-fabric-react/lib/Slider'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import TableDoughnutDisplay from './../table/TableDoughnutDisplay'
import {columns, items} from './../../spl/TableSpl'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class HDFSCapacity extends React.Component<any, any> {
  
  public render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row" style={{ maxWidth: "500px" }}>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <NotYetAvailable/>
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Slider
                label='Maximum Number of HDFS Data Nodes.'
                min={ 0 }
                max={ 3 }
                step={ 1 }
                defaultValue={ 0 }
                showValue={ true }
                disabled={ true }
                onChange={ (value) => toastr.warning('Not yet available', 'Wait on the next version to get ' + value + ' worker(s).') }
                />
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <TableDoughnutDisplay columns={columns} items={items} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}
