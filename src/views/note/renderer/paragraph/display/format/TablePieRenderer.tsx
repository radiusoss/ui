import * as React from 'react'
import TableBaseRenderer from './_TableBaseRenderer'
import {Pie} from 'react-chartjs-2'

export default class TablePieRenderer extends TableBaseRenderer {
  pieData = {}

  constructor(props) {
    super(props)
    const { columns, items } = props
    this.pieData = this.preparePieData(columns, items, this.pieData)
  }

  render() {
    return (
      <div>
        <Pie
          data={this.pieData}
        />
      </div>
    )
  }

  protected preparePieData(columns, items, data) {

    let labels = []
    let backgroundColor = []
    let hoverBackgroundColor = []
    for (var i = 0; i < items.length; i++) {
      labels = labels.concat(items[i][columns[0]['name']])
      let color = this.getRandomColor()
      backgroundColor = backgroundColor.concat(color)
      hoverBackgroundColor = hoverBackgroundColor.concat(color)
    }
    data['labels'] = labels

    let datasets = []
    for (var i = 1; i < columns.length; i++) {
      let serieName = columns[i]['name']
      let dataset = {
        label: serieName,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor
      }
      let data = []
      for (var j = 0; j < items.length; j++) {
        data = data.concat(items[j][serieName])
      }
      dataset['data'] = data
      datasets = datasets.concat(dataset)
    }

    data['datasets'] = datasets

    return data

  }

}
