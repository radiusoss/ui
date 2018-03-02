import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import NotebookApi from './../../api/notebook/NotebookApi'
import { DetailsList, DetailsListLayoutMode, ConstrainMode, Selection } from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import * as isEqual from 'lodash.isequal'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class TableTextDisplay extends React.Component<any, any> {
  private detailsList: DetailsList
  private selection: Selection
  private readonly notebookApi: NotebookApi

  state = {
    columns: [],
    items: [],
    filteredItems: [],
    selectionDetails: ''
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.selection = new Selection({
      onSelectionChanged: () => this.setState({ 
        selectionDetails: this.getSelectionDetails() 
      })
    })
    var { columns, items } = props
    if (items) {
      this.state = {
        columns: columns,
        items: items,
        filteredItems: items,
        selectionDetails: this.getSelectionDetails()
      }
    }

  }

  public render() {
    var { columns, items, filteredItems, selectionDetails } = this.state
    return (
      <div>
        <div>{ selectionDetails }</div>
        <TextField
//          label='Filter on first column:'
          placeholder='Filter on first column.'
          onChanged={ text => this.setState({
             filteredItems: text ? items.filter(i => i[this.state.columns[0]['name']].toLowerCase().indexOf(text) > -1) : items 
           })}
        />
        <MarqueeSelection selection={ this.selection }>
          <DetailsList
            columns={ columns }
            items={ filteredItems }
            layoutMode={ DetailsListLayoutMode.justified }
            selection={ this.selection }
            constrainMode={ ConstrainMode.horizontalConstrained }
            selectionPreservedOnEmptyClick={ true }
            ref={ ref => this.detailsList = ref }
            compact={ true }
            setKey='set'
            />
        </MarqueeSelection>
      </div>
    )
  }

  private getSelectionDetails(): string {
    var selectionCount = this.selection.getSelectedCount()
    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this.selection.getSelection()[0] as any).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

}
