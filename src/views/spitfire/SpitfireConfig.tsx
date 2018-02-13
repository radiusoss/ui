import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';

var items = []

var columns = [{
    key: 'Key',
    name: 'Key',
    fieldName: 'key',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true
  },{
    key: 'Value',
    name: 'Value',
    fieldName: 'value',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true
  }]

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SpitfireConfig extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private selection: Selection

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this.getSelectionDetails() })
    });
    this.state = {
      items: items,
      selectedItems: items,
      selectionDetails: this.getSelectionDetails(),
      configuration: {}
    }
  }

  public render() {
    var { items, selectedItems, selectionDetails } = this.state;
    return (
      <div>
        <br/>
        <h3>Spitfire Configuration</h3>
        <h4>For security reasons, some key/value pairs will not be shown.</h4>
        <div>
          <div>{ selectionDetails }</div>
          <TextField
            label='Filter key by name'
            onChanged={ text => this.setState({ selectedItems: text ? items.filter(i => i.name.toLowerCase().indexOf(text) > -1) : items }) }
          />
          <MarqueeSelection selection={ this.selection }>
            <DetailsList
              items={ selectedItems }
              columns={ columns }
              setKey='set'
              layoutMode={ DetailsListLayoutMode.fixedColumns }
              selection={ this.selection }
              selectionPreservedOnEmptyClick={ true }
              onItemInvoked={ (item) => alert(`Item invoked: ${item.name}`) }
            />
          </MarqueeSelection>
        </div>
      </div>
    )
  }

  public async componentDidMount() {
    var configuration = await this.notebookApi.configuration()
    console.log('configuration', configuration)
    var data = configuration.result.body
    console.log('data', data)
    var keys = Object.keys(data)
    keys.forEach( key => {
      var value = data[key]
      items.push({
        key: key,
        name: key,
        value: value
      })
    })
    this.setState({
      items: items,
      configuration: configuration
    })
  }

  private getSelectionDetails(): string {
    var selectionCount = this.selection.getSelectedCount();
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
