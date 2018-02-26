import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import Vega, { createClassFromSpec } from 'react-vega'
import VegaLite, { createClassFromLiteSpec } from 'react-vega-lite'
import * as barchart_data from './data/barchart'
import * as barchart1 from './specs/barchart1'
// import * as barchart1 from './specs/barchart1.json'
import * as barchart2 from './specs/barchart2'
import * as unemployment_across_industries from './data/unemployment-across-industries'
import * as stacked_area_stream from './specs/stacked_area_stream'
import * as miserables_data from './data/miserables'
import * as miserables_specs from './specs/miserables'

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
  BarChartLite = createClassFromLiteSpec(spec1_lite)

  Network = createClassFromSpec(miserables_specs.default)
  miserables_data_nodes_links = {
    'node-data': miserables_data.default.nodes,
    'link-data': miserables_data.default.links
  }

  state = {
    info: '',
    data: barchart_data.default,
    barchart: barchart1.default,
    barchart1: barchart1.default,
    barchart2: barchart2.default
  }
  
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12"
//              key={new Date().getMilliseconds().toString()}
              >
            <this.Network
              data={this.miserables_data_nodes_links}
              />
{/*
              <Vega
                width={700}
                height={500}
                renderer="canvas"
                data={this.miserables_data_nodes_links}
                spec={miserables_specs.default}
                />
*/}
                </div>
{/*
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <VegaLite
                data={unemployment_across_industries.default}
                spec={stacked_area_stream.default}
                />
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <button onClick={this.toggleSpec}>Toggle Spec</button>
              <button onClick={this.updateData}>Update Data</button>
              <Vega
                data={this.state.data}
                spec={this.state.barchart}
                onSignalTooltip={this.handleHover}
                />
              {this.state.info}
              <hr/>
              <this.BarChart
                data={this.state.data}
                onSignalTooltip={this.handleHover}
                />
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <VegaLite 
                data={data1_lite} 
                spec={spec1_lite}
                />
              <this.BarChartLite 
                data={data1_lite} 
                />
            </div>
*/}
          </div>
        </div>
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
  private handleHover(...hover) {
    this.setState({
      info: JSON.stringify(hover)
    })
  }

  @autobind
  private updateData() {
    const table2 = []
    for (let i = 1; i <= 20; i++) {
      table2.push({
        category: String.fromCharCode(65 + i),
        amount: Math.round(Math.random() * 100)
      })
    }
    this.setState({ 
      data: { table2 } 
    })
  }

}
