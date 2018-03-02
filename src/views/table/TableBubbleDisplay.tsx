import * as React from 'react'
import TableBaseDisplay from './_TableBaseDisplay'
import { Bubble } from 'react-chartjs-2/lib'

export default class TableBubbleDisplay extends TableBaseDisplay {
  bubbleData = {}

  public constructor(props) {
    super(props)
    const { columns, items } = props
    this.prepareBubbleData(columns, items)
  }

  public render() {
    return (
      <div>
        <Bubble
          data={this.bubbleData}
//          options={this.options}
        />
      </div>
    )
  }

  private prepareBubbleData(columns, items) {
    var labels = []
    for (var i = 0; i < 3; i++) {
      labels.push(columns[i]['name'])
    }
    var color = this.getRandomColor()
    var datasets = {
      label: `X=${labels[0]} Y=${labels[1]} S=${labels[2]}`,
      fill: false,
      lineTension: 0.1,
      backgroundColor: color,
      borderColor: color,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: color,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10
    }
    var data = []
    for (var i = 0; i < items.length; i++) {
      data.push({
        x: parseInt(items[i][labels[0]]),
        y: parseInt(items[i][labels[1]]),
        r: parseInt(items[i][labels[2]])
      })
    }
    var bubbleData = {
      labels: labels,
      datasets: [{
        label: 'Dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data
      }]
    }
    console.log('---', bubbleData)
    this.bubbleData = bubbleData
  }

}
