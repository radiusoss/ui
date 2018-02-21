import * as React from 'react'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import TableBarDisplay from './../table/TableBarDisplay'
import TableDoughnutDisplay from './../table/TableDoughnutDisplay'
import {columns, items} from './../../spl/TableSpl'

export default class Budget extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <div style={{float: "left"}}>
          <Icon iconName='Money' className='ms-Icon50' />
        </div>
        <div style={{float: "left"}}>
          <div className='ms-font-su'>Budget</div>
        </div>
        <div className="ms-clearfix"/>
        <div className="ms-Grid ms-fadeIn500">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <div className="ms-font-su">Gain: $ 1300</div>
            </div>
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <div className="ms-font-xl">Actual Consumption: $ 1000</div>
              <div className="ms-font-xl">Without Kuber: $ 2300</div>
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <TableBarDisplay columns={columns} items={items} />
            </div>
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <TableDoughnutDisplay columns={columns} items={items} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}
