import * as React from 'react'
import TableBaseDisplay from './_TableBaseDisplay'
import {Line} from 'react-chartjs-2'

export default class TableLineDisplay extends TableBaseDisplay {
  lineData = {}

  constructor(props) {
    super(props)
    const { columns, items } = props
    this.lineData = this.prepareData(columns, items, this.lineData)
  }

  render() {
    return (
      <div>
        <Line
          data={this.lineData}
          options={this.options}
        />
      </div>
    )
  }

}
