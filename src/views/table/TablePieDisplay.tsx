import * as React from 'react'
import TableBaseDisplay from './_TableBaseDisplay'
import {Pie} from 'react-chartjs-2'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class TablePieDisplay extends TableBaseDisplay {
  pieData = {}

  public constructor(props) {
    super(props)
    const { columns, items } = props
    this.pieData = this.preparePieData(columns, items, this.pieData)
  }

  public render() {
    return (
      <div className={styles.overflowYOverlay} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Pie
          data={this.pieData}
        />
      </div>
    )
  }

  protected preparePieData(columns, items, data) {
    var labels = []
    var backgroundColor = []
    var hoverBackgroundColor = []
    for (var i = 0; i < items.length; i++) {
      labels = labels.concat(items[i][columns[0]['name']])
      var color = this.getRandomColor()
      backgroundColor = backgroundColor.concat(color)
      hoverBackgroundColor = hoverBackgroundColor.concat(color)
    }
    data['labels'] = labels
    var datasets = []
    for (var i = 1; i < columns.length; i++) {
      var serieName = columns[i]['name']
      var dataset = {
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
