import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../../../actions/NotebookActions'
import TableData from '../../../../../util/data/TableData'
import TableTextRenderer from './format/TableTextRenderer'
import TableLineRenderer from './format/TableLineRenderer'
import TablePieRenderer from './format/TablePieRenderer'
import TableBarRenderer from './format/TableBarRenderer'
import TableBarHorizontalRenderer from './format/TableBarHorizontalRenderer'
import TableBubbleRenderer from './format/TableBubbleRenderer'
import TableDoughnutRenderer from './format/TableDoughnutRenderer'
import TableScatterRenderer from './format/TableScatterRenderer'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import NotebookApi from './../../../../../api/notebook/NotebookApi'
import * as stylesImport from './../../../../_styles/Styles.scss'
const styles: any = stylesImport
import * as isEqual from 'lodash.isequal'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class TableRenderer extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  private leftItems = [
    {
      key: 'Table',
      name: '',
      icon: 'Table',
      onClick: (e) => this.updateFormat(e, 'text')
    },
    {
      key: 'Line',
      name: '',
      icon: 'Chart',
      onClick: (e) => this.updateFormat(e, 'line')
    },
    {
      key: 'Bar',
      name: '',
      icon: 'BarChart4',
      onClick: (e) => this.updateFormat(e, 'barchart')
    },
    {
      key: 'BarHorizontal',
      name: '',
      icon: 'BarChartHorizontal',
      onClick: (e) => this.updateFormat(e, 'barchart-horizontal')
    },
    {
      key: 'Pie',
      name: '',
      icon: 'PieDouble',
      onClick: (e) => this.updateFormat(e, 'pie')
    },
    {
      key: 'Doughnut',
      name: '',
      icon: 'DonutChart',
      onClick: (e) => this.updateFormat(e, 'doughnut')
    },
    {
      key: 'Scatter',
      name: '',
      icon: 'Dialpad',
      onClick: (e) => this.updateFormat(e, 'scatter')
    },
    {
      key: 'Bubble',
      name: '',
      icon: 'GridViewSmall',
      onClick: (e) => this.updateFormat(e, 'bubble')
    }
  ]

  private rightItems: any[] = [{}]

  constructor(props) {

    super(props)

    var format = 'text'
    if (props.p.config.results[0]) {
      var f = props.p.config.results[0].graph.mode
      if (f) {
        format = f
      }
    }
    var tableData = new TableData()
    tableData.loadParagraphResult({type: "TABLE", msg: this.props.data})

    let columnsData = tableData.columns
    let columnNamesData = tableData.columnNames
    let columns = columnNamesData.map( c => {
      return {
        key: c,
        name: c,
        fieldName: c,
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      }
    })

    let rowData: [any] = tableData.rows
    let items = []
    for (let i = 0; i < rowData.length; i++) {
      let row = rowData[i]
      let item = {}
      for (let j = 0; j < columnNamesData.length; j++) {
        item[columnNamesData[j]] = row[j]
      }
      items.push(item)
    }

    this.setState({
    })
    this.state = {
      id: props.id,
      p: props.p,
      data: props.data,
      columns: columns,
      items: items,
      columnsData: columnsData,
      showCommandBar: props.showCommandBar,
      format: format
    }
    this.notebookApi = window["NotebookApi"]
    this.updateTable()
  }

  componentDidMount() {
    this.updateTable()
  }

  public render() {

    let { columns, items, format, showCommandBar } = this.state

    return (

      <div>

       {
          (showCommandBar == true) && 
          <CommandBar
            isSearchBoxVisible={ false }
            items={ this.leftItems }
            farItems={ this.rightItems }
            ref="table-renderer-command-bar"
            className={ styles.commandBarBackground }
          />
        }

        {
          (format == 'text') && <TableTextRenderer columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'line') && <TableLineRenderer columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'barchart') && <TableBarRenderer columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'barchart-horizontal') && <TableBarHorizontalRenderer columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'pie') && <TablePieRenderer columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'doughnut') && <TableDoughnutRenderer columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'scatter') && <TableScatterRenderer columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'bubble') && <TableBubbleRenderer columns={this.state.columns} items={this.state.items} />
        }

      </div>

    )

  }

  private updateTable() {
  }

  private updateFormat(e: MouseEvent, format) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      format: format
    })
    this.scroll()
    this.notebookApi.commitParagraph(this.state.p, this.graph(format))
  }

  private scroll() {
/*
    let renderer = ReactDOM.findDOMNode(this.refs['table-renderer-command-bar'])
    if (renderer) {
      var domNode = ReactDOM.findDOMNode(renderer)
      domNode.scrollIntoView({block: "start", behavior: "smooth"})
    }
*/
  }

  private graph(format: string) {
    return {
      'mode': format,
      'height': 300,
      'optionOpen': false,
      'setting': {
          'table': {
              'tableGridState': {},
              'tableColumnTypeState': {
                  'names': {
                      'name': 'string',
                      'weights': 'string'
                  },
                  'updated': false
              },
              'tableOptionSpecHash': '[{\'name\':\'useFilter\',\'valueType\':\'boolean\',\'defaultValue\':false,\'widget\':\'checkbox\',\'description\':\'Enable filter for columns\'},{\'name\':\'showPagination\',\'valueType\':\'boolean\',\'defaultValue\':false,\'widget\':\'checkbox\',\'description\':\'Enable pagination for better navigation\'},{\'name\':\'showAggregationFooter\',\'valueType\':\'boolean\',\'defaultValue\':false,\'widget\':\'checkbox\',\'description\':\'Enable a footer for displaying aggregated values\'}]',
              'tableOptionValue': {
                  'useFilter': false,
                  'showPagination': false,
                  'showAggregationFooter': false
              },
              'updated': false,
              'initialized': false
          },
          'multiBarChart': {
              'rotate': {
                  'degree': '-45'
              },
              'xLabelStatus': 'default'
          },
          'stackedAreaChart': {
              'rotate': {
                  'degree': '-45'
              },
              'xLabelStatus': 'default'
          },
          'lineChart': {
              'rotate': {
                  'degree': '-45'
              },
              'xLabelStatus': 'default'
          }
      },
      'commonSetting': {},
      'keys': [
          {
              'name': 'name',
              'index': 0,
              'aggr': 'sum'
          }
      ],
      'groups': [],
      'values': [
          {
              'name': 'weights',
              'index': 1,
              'aggr': 'sum'
          }
      ]
    }
  }

}
