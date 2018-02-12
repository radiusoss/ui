import * as React from 'react'
import TableBaseDisplay from './_TableBaseDisplay'
import {Bar} from 'react-chartjs-2';

export default class TableBarDisplay extends TableBaseDisplay {
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
