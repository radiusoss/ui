import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { DefaultButton, PrimaryButton, CompoundButton } from 'office-ui-fabric-react/lib/Button'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import history from './../routes/History'
import { connect } from 'react-redux'
import NotebookApi from './../api/notebook/NotebookApi'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Flows extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private renameFlowTextField: TextField
  private selectionTextField: TextField
  private selection: Selection = new Selection({
    onSelectionChanged: () => this.setState({ selectionDetails: this.getSelectionDetails() })
  })
  private columns = [
    {
      key: 'name',
      name: 'Flows',
      fieldName: 'name',
      minWidth: 300,
      isResizable: true
    },
    {
      key: 'rename',
      name: '',
      fieldName: 'rename',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: 'delete',
      name: '',
      fieldName: 'delete',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    }
  ]
  state = {
    flows: [],
    selectedFlows: [],
    selectedFlowId: '',
    selectedFlowName: '',
    showDeletePanel: false,
    showRenamePanel: false,
    newName: '',
    isNewNameValid: false,
    selectionDetails: this.getSelectionDetails()
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["notebookApi"]
    this.renderItemColumn = this.renderItemColumn.bind(this)
  }

  public render() {    

    let { flows, selectedFlows, selectionDetails } = this.state

    return (

      <div>
{/*
        <div>{ selectionDetails }</div>
*/}
        <TextField
          ref={ ref => this.selectionTextField = ref }
          onChanged={ text => this.setState({ selectedFlows: text ? flows.filter(n => n.name.toLowerCase().indexOf(text) > -1) : flows }) }
        />
{/*
        <MarqueeSelection selection={ this.selection }>
*/}
          <DetailsList
            items={ selectedFlows }
            columns={ this.columns }
            setKey='set'
            layoutMode={ DetailsListLayoutMode.fixedColumns }
            selection={ this.selection }
            selectionPreservedOnEmptyClick={ true }
            onRenderItemColumn={ this.renderItemColumn }
          />
{/*
        </MarqueeSelection>
*/}
{/*
        {flows && flows.map(n => {
          return (
            <div key={n.id}>
              <a href="#"  onClick={ e => this.loadFlow(e, n.id) }>{n.name}</a>
              &nbsp;&nbsp;
              <a href="#"  onClick={ e => this.showRenamePanel(e, n.id, n.name) }>rename</a>
              &nbsp;&nbsp;
              <a href="#"  onClick={ e => this.showDeletePanel(e, n.id, n.name) }>delete</a>
              <br/>
            </div>
          )
        })}
*/}
        <Panel
          isOpen={ this.state.showDeletePanel }
          type={ PanelType.smallFixedNear }          
          onDismiss={ () => this.closeDeletePanel() }
          headerText='Confirm Flow Delete'
          isBlocking={ true }
        >
          <CompoundButton
            description={this.state.selectedFlowName}
            onClick={ (e => this.deleteSelectedFlow(e))}
            className='ms-Button--primary'
            autoFocus={true}
          >
            Yes, Delete this Flow
          </CompoundButton>
          <hr/>
          <DefaultButton
            text='No, cancel'
            onClick={ () => this.closeDeletePanel() }
           />
        </Panel>

        <Panel
          isOpen={ this.state.showRenamePanel }
          type={ PanelType.smallFixedNear }          
          onDismiss={ () => this.closeRenamePanel() }
          headerText='Rename Flow'
          isBlocking={ true }
        >
          <form onSubmit={e => this.submitRenameForm(e) }>
            <TextField
              placeholder='New name'
              defaultValue={this.state.selectedFlowName}
              label={this.state.selectedFlowName}
              autoFocus={true}
              onChanged={v => this.handleTextFieldChange(v)}
              ref={ ref => this.renameFlowTextField = ref }
              onGetErrorMessage={ v => this.getErrorMessage(v) }
            />
            <PrimaryButton
              text='Rename Flow'
              disabled={!this.state.isNewNameValid}
              onClick={ (e) => this.reanameSelectedFlow(e) }
            />
          </form>
        </Panel>

      </div>

    )

  }

  public componentDidMount() {
    this.notebookApi.listFlows()
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if ((webSocketMessageReceived.op == "LIST_FLOWS") || (webSocketMessageReceived.op == "SAVE_FLOWS")) {
      this.setState ({
        flows: webSocketMessageReceived.data.flows,
        selectedFlows: webSocketMessageReceived.data.flows
      })
      this.selectionTextField.setState({
        value: ''
      })
    }
  }

  @autobind
  private loadFlow(e: React.MouseEvent<HTMLAnchorElement>, flowId) {
    e.stopPropagation()
    e.preventDefault()
    history.push(`/dla/flow/dag/${flowId}`)
  }

  private showDeletePanel(e: React.MouseEvent<HTMLAnchorElement>, flowId, flowName) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      selectedFlowId: flowId,
      selectedFlowName: flowName,
      showDeletePanel: true 
    })
  }

  private closeDeletePanel() {
    this.setState({ showDeletePanel: false });
  }

  private deleteSelectedFlow(e) {
    e.stopPropagation()
    e.preventDefault()
    this.state.selectedFlowName.indexOf('~Trash/') == 0
      ? this.notebookApi.deleteFlow(this.state.selectedFlowId)
      : this.notebookApi.moveFlowToTrash(this.state.selectedFlowId)
    this.closeDeletePanel()
  }

  private showRenamePanel(e: React.MouseEvent<HTMLAnchorElement>, flowId, flowName) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      selectedFlowId: flowId,
      selectedFlowName: flowName,
      showRenamePanel: true 
    })
  }

  private closeRenamePanel() {
    this.setState({ showRenamePanel: false });
  }

  private reanameSelectedFlow(e) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.renameFlow(this.state.selectedFlowId, this.renameFlowTextField.value)
    this.closeRenamePanel()
  }

  private handleTextFieldChange(value: string): void {
    this.setState({
      newName: value
    })
  }

  private submitRenameForm(event: React.FormEvent<HTMLElement>): void {
    event.preventDefault()
    this.handleTextFieldChange(this.renameFlowTextField.value)
  }

  @autobind
  private getErrorMessage(value: string): string {
    if (value.length > 2) {
        if (this) this.setState({
          isNewNameValid: true
        })
        return ""
      }
      else {
        if (this) this.setState({
          isNewNameValid: false
        })
       return `The length of the input value should more than 2, actual is ${value.length}.`
      }
  }

  private getSelectionDetails(): string {
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

  private renderItemColumn(item, index, column) {
    let fieldContent = item[column.fieldName]
    switch (column.key) {
      case 'name':
        return <a href="#" onClick={ e => this.loadFlow(e, item.id) }><strong>{item.name}</strong></a>
      case 'rename':
        return <a href="#" onClick={ e => this.showRenamePanel(e, item.id, item.name) }>rename</a>
      case 'delete':
        return  <a href="#" onClick={ e => this.showDeletePanel(e, item.id, item.name) }>delete</a>
      default:
        return <span>{ fieldContent }</span>
    }
  }

}
