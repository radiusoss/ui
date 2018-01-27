import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../../../../actions/NotebookActions'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import NotebookApi from './../../../../../../api/notebook/NotebookApi'
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import * as isEqual from 'lodash.isequal'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class TableTextRenderer extends React.Component<any, any> {
  private detailsList: DetailsList
//  private selection: Selection;
  private readonly notebookApi: NotebookApi

  state = {
    columns: [],
    items: [],
    filteredItems: []
//    selectionDetails: this._getSelectionDetails()
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
/*
    this.selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    })
*/
    let { columns, items } = props

    if (items) {
      this.state = {
        columns: columns,
        items: items,
        filteredItems: items
      }
    }

  }

  public render() {

//    let { items, selectionDetails } = this.state
    let { columns, items, filteredItems } = this.state

    return (

      <div>
{/*
        <div>{ selectionDetails }</div>
*/}
        <TextField
//          label='Filter by name:'
          placeholder='Filter on first column'
          onChanged={ text => this.setState({
             filteredItems: text ? items.filter(i => i[this.state.columns[0]['name']].toLowerCase().indexOf(text) > -1) : items 
           })}
        />
{/*
        <MarqueeSelection selection={ this.selection }>
*/}
        <DetailsList
          columns={ columns }
          items={ filteredItems }
          setKey='set'
          layoutMode={ DetailsListLayoutMode.fixedColumns }
//            selection={ this.selection }
          selectionPreservedOnEmptyClick={ true }
          ref={ ref => this.detailsList = ref }
          compact={ true }
        />
{/*
        </MarqueeSelection>
*/}
      </div>
    )
  }
/*
  private _getSelectionDetails(): string {
    let selectionCount = this.selection.getSelectedCount();
    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this.selection.getSelection()[0] as any).name;
      default:
        return `${selectionCount} items selected`;
    }
  }
*/
  public componentWillReceiveProps(nextProps) {
    let { columns, items } = nextProps
    if (items) {
      this.setState({
        columns: columns,
        items: items,
        filteredItems: items
      })
    }

  }

}
