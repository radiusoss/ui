import * as React from 'react'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import TableBarDisplay from './../table/TableBarDisplay'
import TableDoughnutDisplay from './../table/TableDoughnutDisplay'
import NotYetAvailable from './../message/NotYetAvailable'

const columns = JSON.parse(`
[{"key":"name","name":"name","fieldName":"name","minWidth":100,"maxWidth":200,"isResizable":true},{"key":"weights","name":"weights","fieldName":"weights","minWidth":100,"maxWidth":200,"isResizable":true}]
`)
const items = JSON.parse(`
[{"name":"var01","weights":"-3.385617903830657"},{"name":"var11","weights":"0.06704145990137461"},{"name":"var21","weights":"-0.8419034559925032"},{"name":"var31","weights":"1.9064748213341105"},{"name":"var41","weights":"-1.9547678595862985"},{"name":"var51","weights":"-3.6780866232160676"},{"name":"var61","weights":"-3.7549158736091792"},{"name":"var71","weights":"2.720971206094783"},{"name":"var81","weights":"-2.235645242036414"},{"name":"var91","weights":"-3.599768233370093"},{"name":"var101","weights":"0.24330142207373767"},{"name":"var111","weights":"-2.127092813590093"},{"name":"var121","weights":"-3.4890744088669683"}]
`)

export default class Costs extends React.Component<any, any> {

  public render() {
    return (
      <div>

        <div style={{float: "left"}}>
          <Icon iconName='Money' className='ms-Icon50' />
        </div>
        <div style={{float: "left"}}>
          <div className='ms-font-su'>Costs</div>
        </div>
        <div className="ms-clearfix"/>

        <NotYetAvailable/>

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
