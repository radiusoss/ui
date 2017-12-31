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
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import NotebookApi from './../../../../../api/notebook/NotebookApi'
import * as stylesImport from './../../../../_styles/Styles.scss'
const styles: any = stylesImport
import * as isEqual from 'lodash.isequal'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class TableRenderer extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    id: '',
    data: {},
    columns: [],
    columnsData: [],
    items: [],
    format: 'text'
  }

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
      key: 'Bubble',
      name: '',
      icon: 'Dialpad',
      onClick: (e) => this.updateFormat(e, 'bubble')
    }
  ]

  private rightItems: any[] = [{}]

  constructor(props) {
    super(props)
    this.notebookApi = window["notebookApi"]
  }

  componentDidMount() {
    let { id, data } = this.props
    this.updateTable(id, data)
  }

  public render() {

    let { columns, items, format } = this.state

    return (

      <div>

        <CommandBar
          isSearchBoxVisible={ false }
          items={ this.leftItems }
          farItems={ this.rightItems }
          ref="table-renderer-command-bar"
          className={ styles.commandBarBackground }
        />

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
          (format == 'bubble') && <TableBubbleRenderer columns={this.state.columns} items={this.state.items} />
        }

      </div>

    )

  }

  private updateTable(id, data) {

    let tableData = new TableData()
    tableData.loadParagraphResult({type: "TABLE", msg: data})

    let columnsData = tableData.columns
    this.setState({
      columnsData: columnsData
    })

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
      id: id,
      data: data,
      columns: columns,
      items: items
    })

  }

  private updateFormat(e: MouseEvent, format) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      format: format
    })
    this.scroll()
  }

  scroll() {
/*
    let renderer = ReactDOM.findDOMNode(this.refs['table-renderer-command-bar'])
    if (renderer) {
      var domNode = ReactDOM.findDOMNode(renderer)
      domNode.scrollIntoView({block: "start", behavior: "smooth"})
    }
*/
  }

}
