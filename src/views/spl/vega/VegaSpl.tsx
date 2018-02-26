import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import Vega, { createClassFromSpec } from 'react-vega'
import VegaLite, { createClassFromLiteSpec } from 'react-vega-lite'
import * as barchart_data from './data/barchart'
import * as barchart1 from './specs/barchart1'
//import * as barchart1 from './specs/barchart1.json'
import * as barchart2 from './specs/barchart2'
import * as unemployment_across_industries from './data/unemployment-across-industries'
import * as stacked_area_stream from './specs/stacked_area_stream'

const data1_lite = {
  "values": [
    {"a": "A","b": 20}, {"a": "B","b": 34}, {"a": "C","b": 55},
    {"a": "D","b": 19}, {"a": "E","b": 40}, {"a": "F","b": 34},
    {"a": "G","b": 91}, {"a": "H","b": 78}, {"a": "I","b": 25}
  ]
}

const data2_lite = {
  "values": [
    {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
    {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
    {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
  ]
}

const spec1_lite = {
  "description": "A simple bar chart with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}

export const spec2_lite = {
  "description": "A simple bar chart with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "b", "type": "quantitative"},
    "y": {"field": "a", "type": "ordinal"},
  }
}

export default class VegaSpl extends React.Component<any, any> {

  BarChart = createClassFromSpec(barchart1.default)
  BarChartLite = createClassFromLiteSpec(spec1_lite);

  state = {
    info: '',
    data: barchart_data.default,
    barchart: barchart1.default,
    barchart1: barchart1.default,
    barchart2: barchart2.default
  }
  
  constructor(props) {
    super(props)
    console.log('---', unemployment_across_industries.default)
    console.log('---', stacked_area_stream.default)
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleSpec}>Toggle Spec</button>
        <button onClick={this.updateData}>Update Data</button>
        <Vega
          data={this.state.data}
          spec={this.state.barchart}
          onSignalTooltip={this.handleHover}
          />
        <this.BarChart
          data={this.state.data}
          onSignalTooltip={this.handleHover}
          />
        {this.state.info}
        <hr/>
        <VegaLite 
          data={data1_lite} 
          spec={spec1_lite}
          />
        <this.BarChartLite 
          data={data1_lite} 
          />
        <hr/>
        <VegaLite
          data={unemployment_across_industries.default}
          spec={stacked_area_stream.default}
          />
      </div>
    )
  }

  @autobind
  private toggleSpec() {
    if (this.state.barchart === this.state.barchart1) {
      this.setState({ 
        barchart: this.state.barchart2
      })
    } else {
      this.setState({ 
        barchart: this.state.barchart1 
      })
    }
  }

  @autobind
  private handleHover(...args) {
    this.setState({
      info: JSON.stringify(args)
    })
  }

  @autobind
  private updateData() {
    const table = []
    for (let i = 1; i <= 20; i++) {
      table.push({
        category: String.fromCharCode(65 + i),
        amount: Math.round(Math.random() * 100)
      })
    }
    this.setState({ 
      data: { table } 
    })
  }

}
