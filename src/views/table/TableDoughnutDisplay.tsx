import * as React from 'react'
import TableBaseDisplay from './_TableBaseDisplay'
import { Doughnut } from 'react-chartjs-2'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class TableDoughnutDisplay extends TableBaseDisplay {

  doughnutData = {}
/*
  doughnutData = {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  }
*/
  public constructor(props) {
    super(props)
    const { columns, items } = props
    this.prepareDoughnutData(columns, items)
  }

  public render() {
    return (
      <div className={styles.overflowYOverlay} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Doughnut
          data={this.doughnutData}
//          options={this.options}
        />
      </div>
    )
  }

  protected prepareDoughnutData(columns, items) {
    var labels = []
    var backgroundColor = []
    var hoverBackgroundColor = []
    for (var i = 0; i < items.length; i++) {
      labels.push(items[i][columns[0]['name']])
      var color = this.getRandomColor()
      backgroundColor.push(color)
      hoverBackgroundColor.push(color)
    }
    var data = []
      for (var i = 0; i < columns.length; i++) {
        var acc = 0
        for (var j = 0; j < items.length; j++) {
        var val = items[j][columns[i].fieldName]
        acc += parseInt(val)
      }
      data.push(acc)
    }
    var doughnutData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor
      }]
    }
    this.doughnutData = doughnutData
  }

}
