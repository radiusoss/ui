import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import TableData from './../../util/data/TableData'
import TableTextDisplay from './../table/TableTextDisplay'
import TableLineDisplay from './../table/TableLineDisplay'
import TablePieDisplay from './../table/TablePieDisplay'
import TableBarDisplay from './../table/TableBarDisplay'
import TableBarHorizontalDisplay from './../table/TableBarHorizontalDisplay'
import TableBubbleDisplay from './../table/TableBubbleDisplay'
import TableDoughnutDisplay from './../table/TableDoughnutDisplay'
import TableScatterDisplay from './../table/TableScatterDisplay'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import NotebookApi from './../../api/notebook/NotebookApi'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport
import * as isEqual from 'lodash.isequal'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class TableDisplay extends React.Component<any, any> {
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
    tableData.loadParagraphDisplay({type: "TABLE", msg: this.props.data})
    var columnsData = tableData.columns
    var columnNamesData = tableData.columnNames
    var columns = columnNamesData.map( c => {
      return {
        key: c,
        name: c,
        fieldName: c,
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      }
    })
    var rowData: [any] = tableData.rows
    var items = []
    for (var i = 0; i < rowData.length; i++) {
      var row = rowData[i]
      var item = {}
      for (var j = 0; j < columnNamesData.length; j++) {
        item[columnNamesData[j]] = row[j]
      }
      items.push(item)
    }
    this.state = {
      id: props.id,
      p: props.p,
      data: props.data,
      columns: columns,
      items: items,
      columnsData: columnsData,
      showGraphBar: props.showGraphBar,
      format: format
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    var { columns, items, format, showGraphBar } = this.state
    return (
      <div>
       {
          (showGraphBar == true) && 
          <CommandBar
            isSearchBoxVisible={ false }
            items={ this.leftItems }
            farItems={ this.rightItems }
            ref="table-renderer-command-bar"
            className={ styles.commandBarBackgroundTransparent }
          />
        }
        {
          (format == 'text') && <TableTextDisplay columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'line') && <TableLineDisplay columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'barchart') && <TableBarDisplay columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'barchart-horizontal') && <TableBarHorizontalDisplay columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'pie') && <TablePieDisplay columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'doughnut') && <TableDoughnutDisplay columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'scatter') && <TableScatterDisplay columns={this.state.columns} items={this.state.items} />
        }
        {
          (format == 'bubble') && <TableBubbleDisplay columns={this.state.columns} items={this.state.items} />
        }
      </div>
    )

  }

  private updateFormat(e: MouseEvent, format) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      format: format
    })
    this.notebookApi.commitParagraphWithGraph(this.state.p, this.graph(format))
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
