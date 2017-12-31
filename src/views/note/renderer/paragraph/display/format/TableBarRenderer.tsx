import * as React from 'react'
import TableBaseRenderer from './_TableBaseRenderer'
import {Bar} from 'react-chartjs-2';

export default class TableBarRenderer extends TableBaseRenderer {
  barData = {}

  constructor(props) {
    super(props)
    const { columns, items } = props
    this.barData = this.prepareData(columns, items, this.barData)
  }

  render() {
    return (
      <div>
        <Bar
          data={this.barData}
          options={this.options}
        />
      </div>
    )
  }

}
