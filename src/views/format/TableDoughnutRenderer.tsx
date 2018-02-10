import * as React from 'react'
import TableBaseRenderer from './_TableBaseRenderer'
import {Doughnut} from 'react-chartjs-2'

export default class TableDoughnutRenderer extends TableBaseRenderer {

  spl = {
    labels: [
      'Red',
      'Green',
      'Yellow'
    ],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
      ],
      hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
      ]
    }
  ]
}

  constructor(props) {
    super(props)
    const { columns, items } = props
  }

  render() {
    return (
      <div>
        <Doughnut
          data={this.spl}
//          options={this.options}
        />
      </div>
    )
  }

}
