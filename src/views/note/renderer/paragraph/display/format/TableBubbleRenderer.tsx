import * as React from 'react'
import TableBaseRenderer from './_TableBaseRenderer'
import {Bubble} from 'react-chartjs-2/lib'

export default class TableBubbleRenderer extends TableBaseRenderer {
  bubbleData = {}

  spl = {
    labels: ['January'],
    datasets: [
      {
        label: 'My First dataset',
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
        data: [{x:10,y:20,r:5}]
      }
    ]
  }

  constructor(props) {
    super(props)
    const { columns, items } = props
//    this.prepareBubbleData(columns, items, this.bubbleData)
  }

  render() {
    return (
      <div>
        <Bubble
          data={this.spl}
//          data={this.bubbleData}
          //          options={this.options}
        />
      </div>
    )
  }

  protected prepareBubbleData(columns, items, bubbleData) {

    let labels = []
    for (var i = 0; i < items.length; i++) {
      labels = labels.concat(items[i][columns[0]['name']])
    }
    bubbleData['labels'] = labels

    let datasets = []
    let data = []
    for (var j = 0; j < items.length; j++) {
      data = data.concat({
        x: items[j][columns[0]['name']],
        y: items[j][columns[1]['name']],
        r: items[j][columns[2]['name']]})
    }
    let color = this.getRandomColor()
    let dataset = {
      label: `X=${columns[0]['name']} X=${columns[1]['name']} S=${columns[2]['name']}`,
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
    dataset['data'] = data
    datasets = datasets.concat(dataset)

    bubbleData['datasets'] = datasets

  }

}
