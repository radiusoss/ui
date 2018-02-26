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
import * as miserables from './data/miserables'

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

export const net_spec = {
  "$schema": "https://vega.github.io/schema/vega/v3.json",
  "width": 700,
  "height": 500,
  "padding": 0,
  "autosize": "none",
  "signals": [
    { "name": "cx", "update": "width / 2" },
    { "name": "cy", "update": "height / 2" },
    { "name": "nodeRadius", "value": 8,
      "bind": {"input": "range", "min": 1, "max": 50, "step": 1} },
    { "name": "nodeCharge", "value": -30,
      "bind": {"input": "range", "min":-100, "max": 10, "step": 1} },
    { "name": "linkDistance", "value": 30,
      "bind": {"input": "range", "min": 5, "max": 100, "step": 1} },
    { "name": "static", "value": true,
      "bind": {"input": "checkbox"} },
    {
      "description": "State variable for active node fix status.",
      "name": "fix", "value": 0,
      "on": [
        {
          "events": "symbol:mouseout[!event.buttons], window:mouseup",
          "update": "0"
        },
        {
          "events": "symbol:mouseover",
          "update": "fix || 1"
        },
        {
          "events": "[symbol:mousedown, window:mouseup] > window:mousemove!",
          "update": "2", "force": true
        }
      ]
    },
    {
      "description": "Graph node most recently interacted with.",
      "name": "node", "value": null,
      "on": [
        {
          "events": "symbol:mouseover",
          "update": "fix === 1 ? item() : node"
        }
      ]
    },
    {
      "description": "Flag to restart Force simulation upon data changes.",
      "name": "restart", "value": false,
      "on": [
        {"events": {"signal": "fix"}, "update": "fix > 1"}
      ]
    }
  ],
  "data": [
    {
      "name": "node-data",
      "format": {"type": "json", "property": "nodes"}
    },
    {
      "name": "link-data",
      "format": {"type": "json", "property": "links"}
    }
  ],
  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "range": {"scheme": "category20c"}
    }
  ],
  "marks": [
    {
      "name": "nodes",
      "type": "symbol",
      "zindex": 1,

      "from": {"data": "node-data"},
      "on": [
        {
          "trigger": "fix",
          "modify": "node",
          "values": "fix === 1 ? {fx:node.x, fy:node.y} : {fx:x(), fy:y()}"
        },
        {
          "trigger": "!fix",
          "modify": "node", "values": "{fx: null, fy: null}"
        }
      ],

      "encode": {
        "enter": {
          "fill": {"scale": "color", "field": "group"},
          "stroke": {"value": "white"}
        },
        "update": {
          "size": {"signal": "2 * nodeRadius * nodeRadius"},
          "cursor": {"value": "pointer"}
        }
      },

      "transform": [
        {
          "type": "force",
          "iterations": 300,
          "restart": {"signal": "restart"},
          "static": {"signal": "static"},
          "forces": [
            {"force": "center", "x": {"signal": "cx"}, "y": {"signal": "cy"}},
            {"force": "collide", "radius": {"signal": "nodeRadius"}},
            {"force": "nbody", "strength": {"signal": "nodeCharge"}},
            {"force": "link", "links": "link-data", "distance": {"signal": "linkDistance"}}
          ]
        }
      ]
    },
    {
      "type": "path",
      "from": {"data": "link-data"},
      "interactive": false,
      "encode": {
        "update": {
          "stroke": {"value": "#ccc"},
          "strokeWidth": {"value": 0.5}
        }
      },
      "transform": [
        {
          "type": "linkpath", "shape": "line",
          "sourceX": "datum.source.x", "sourceY": "datum.source.y",
          "targetX": "datum.target.x", "targetY": "datum.target.y"
        }
      ]
    }
  ]
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
  }

  render() {
//    var net_data = miserables.default
    var net_data = {
      'node-data': miserables.default,
      'link-data': miserables.default
    }
    console.log('---', net_data)
    console.log('---', net_spec)
    return (
      <div>
        <hr/>
        <Vega
          data={net_data}
          spec={net_spec}
          />
        <hr/>
        <button onClick={this.toggleSpec}>Toggle Spec</button>
        <button onClick={this.updateData}>Update Data</button>
        <Vega
          data={this.state.data}
          spec={this.state.barchart}
          onSignalTooltip={this.handleHover}
          />
        <hr/>
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
        <hr/>
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
