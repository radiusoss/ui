import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { DefaultButton, PrimaryButton, CompoundButton } from 'office-ui-fabric-react/lib/Button'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode } from 'office-ui-fabric-react/lib/DetailsList'
// import { Selection } from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import { connect } from 'react-redux'
import NotebookApi from './../../api/notebook/NotebookApi'
import Dropzone from 'react-dropzone'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { toastr } from 'react-redux-toastr'

import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/utilities/selection/index'
import { GroupedList, IGroup } from 'office-ui-fabric-react/lib/components/GroupedList/index'
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList'
import { DetailsRow } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsRow'
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone'
import { createListItems, createGroups } from './../../spl/DataSpl'

import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NotesList extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private renameNoteTextField: TextField
//  private selectionTextField: TextField
  private _selection: Selection
/*
  private selection: Selection = new Selection({
    onSelectionChanged: () => this.setState({ selectionDetails: this.getSelectionDetails() })
  })
*/
  private columns = [
    {
      key: 'name',
      name: 'Notes',
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
    notes: [],
    selectedNotes: [],
    selectedNoteId: '',
    selectedNoteName: '',
    showDeletePanel: false,
    showRenamePanel: false,
    newName: '',
    isNewNameValid: false,
//    selectionDetails: this.getSelectionDetails(),
    drops: [],
    _items: [],
    _groups: Array<IGroup>(),
    draggableSupport: false
  }

  constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this._selection = new Selection()
  }

  public render() {
    const { notes, selectedNotes, drops, _items, _groups, draggableSupport } = this.state
//    const { selectionDetails } = this.state
    return (
      <div>
{/*
        <div>{ selectionDetails }</div>
*/}
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg16" style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>
              <Dropzone 
                accept="application/json"
                onDrop={ this.onDrop }
                style={{ width: '100%', height: '50px', borderWidth: '2px', borderColor: 'rgb(102, 102, 102)', borderStyle: 'dashed', borderRadius: '5px' }}
                >
                <div className="ms-fontSize-" >Drop a JSON file here (or click and upload) to import a Note.</div>
{/*
                {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                  if (isDragActive) {
                    return "This note is authorized."
                  }
                  if (isDragReject) {
                    return "This note is not authorized."
                  }
                  return acceptedFiles.length || rejectedFiles.length
                    ? `Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`
                    : "Try dropping some note."
                }}
*/}
{/*
                <div className="ms-fontWeight-semibold">
                  {
                    drops.map(d => {
                      return <div>
                        <div key={d.name}>{d.name} - {d.size} bytes</div>
                        <img src={d.preview} />
                      </div>
                    })
                  }
                </div>
*/}
              </Dropzone>
            </div>
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg16" style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>
              <div>
                <input 
                  type="file"
                  name="import-note"
                  title=""
                  onChange={this.onUploadFile}/>
              </div>
              <div>Select a JSON file to import a Note.
                { (draggableSupport) && (<span className="ms-fontColor-green"> (Your Browser supports Drag-and-Drop)</span>) }
                { (!draggableSupport) && (<span className="ms-fontColor-orange"> (Your Browser does not support Drag-and-Drop)</span>) }
              </div>
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>
              <FocusZone>
                <SelectionZone
                  selection={ this._selection }
                  selectionMode={ SelectionMode.multiple }
                >
                  <GroupedList
                    items={ _items }
                    onRenderCell={ this._onRenderCell }
                    selection={ this._selection }
                    selectionMode={ SelectionMode.multiple }
                    groups={ _groups }
                  />
                </SelectionZone>
              </FocusZone>
            </div>
{/*
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>
              <TextField
                ref={ ref => this.selectionTextField = ref }
                onChanged={ text => this.setState({ selectedNotes: text ? notes.filter(n => n.name.toLowerCase().indexOf(text) > -1) : notes }) }
              />
//              <MarqueeSelection selection={ this.selection }>
                <DetailsList
                  items={ selectedNotes }
                  columns={ this.columns }
                  setKey='set'
                  layoutMode={ DetailsListLayoutMode.fixedColumns }
//                  selection={ this.selection }
                  selectionPreservedOnEmptyClick={ true }
                  onRenderItemColumn={ this.renderItemColumn }
                />
//              </MarqueeSelection>
*/}
            </div>
          </div>
          <Panel
            isOpen={ this.state.showDeletePanel }
            type={ PanelType.smallFixedNear }          
            onDismiss={ () => this.closeDeletePanel() }
            headerText='Confirm Note Delete'
            isBlocking={ true }
            >
              <CompoundButton
                description={this.state.selectedNoteName}
                onClick={ (e => this.deleteSelectedNote(e))}
                className='ms-Button--primary'
                autoFocus={true}
              >
                Yes, Delete this Note
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
            headerText='Rename Note'
            isBlocking={ true }
            >
            <form onSubmit={e => this.submitRenameForm(e) }>
              <TextField
                placeholder='New name'
                defaultValue={this.state.selectedNoteName}
                label={this.state.selectedNoteName}
                autoFocus={true}
                onChanged={v => this.handleTextFieldChange(v)}
                ref={ ref => this.renameNoteTextField = ref }
                onGetErrorMessage={ v => this.getErrorMessage(v) }
                />
              <br/>
              <PrimaryButton
                text='Rename Note'
                disabled={!this.state.isNewNameValid}
                onClick={ (e) => this.renameSelectedNote(e) }
                />
            </form>
          </Panel>
        </div>
    )
  }

  public componentDidMount() {
    this.notebookApi.listNotes()
    if ('draggable' in document.createElement('span')) {
      this.setState({
        draggableSupport: true
      })
    }    
  }

  public componentWillReceiveProps(nextProps) {
    const { spitfireMessageReceived } = nextProps
    if (! spitfireMessageReceived) return
    if (spitfireMessageReceived.op == "NOTES_INFO") {
      var notes = spitfireMessageReceived.data.notes.filter(n => !n.name.startsWith('_'))
      var previousIndex = 0
      var index = 0
      var count = -1
      var folder = ''
      var children = []
      for (var i = 0; i < notes.length; i++) {
        var note = notes[i]
        var name = note.name
        var splits = name.split("/")
        var nextFolder = ''
        if (splits.length > 1) {
          nextFolder = splits[0]
        }
        if (folder != nextFolder) {
          var level = 0
          if (folder != '') {
            level = 1
          }
          children.push({
            key: folder,
            name: folder,
            count: count + 1,
            startIndex: previousIndex
//            level: level
          })
          previousIndex = index
          index++
          count = 0
        }
        else {
          index++
          count++
        }
        folder = nextFolder
      }
      children.push({
        key: folder,
        name: folder,
        count: count + 1,
        startIndex: previousIndex
//            level: level
      })
      var groups = [{
        key: 'notebook',
        name: 'Notebook',
        children: children
      }]
      this._selection.setItems(notes)
      this.setState ({
        notes: notes,
        selectedNotes: notes,
        _items: notes,
        _groups: groups
      })
/*
      this.selectionTextField.setState({
        value: ''
      })
*/
    }
  }

  @autobind
  onUploadFile(event) {
    var file = event.target.files[0]
    console.log(file)
    if (file) {
      this.doRead(file)
    }
  }

  @autobind
  private onDrop(drops) {
/*
    this.setState({
      drops: drops
    })
*/
    drops.forEach(file => {
      this.doRead(file)
    })
  }

  private doRead(file) {
    const reader = new FileReader()
    reader.onabort = () => {
      toastr.error("Import", "File upload has been aborted.")
    }
    reader.onerror = () => {
      toastr.error("Import", "Error during the file upload. Check your network connectivity.")        
    }
    reader.onload = () => {
      const fileAsBinaryString = reader.result
      try {
        var note = JSON.parse(fileAsBinaryString)
      }
      catch (err) {
        toastr.error("Import", "Uploaded file is not a JSON format.")
        return
      }
      if (note.id) {
        toastr.info("Import", "Importing note " + note.id)
        this.notebookApi.importNote(note)
      } else {
        toastr.error("Import", "Uploaded file is a JSON but is missing the id field to be valid.")
      }
    }
    reader.readAsText(file)
}

  @autobind
  private loadNote(e: React.MouseEvent<HTMLAnchorElement>, noteId) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.showNoteLayout(noteId, 'workbench')
  }

  private showDeletePanel(e: React.MouseEvent<HTMLAnchorElement>, noteId, noteName) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      selectedNoteId: noteId,
      selectedNoteName: noteName,
      showDeletePanel: true 
    })
  }

  private closeDeletePanel() {
    this.setState({ showDeletePanel: false });
  }

  private deleteSelectedNote(e) {
    e.stopPropagation()
    e.preventDefault()
    this.state.selectedNoteName.indexOf('~Trash/') == 0
      ? this.notebookApi.deleteNote(this.state.selectedNoteId)
      : this.notebookApi.moveNoteToTrash(this.state.selectedNoteId)
    this.closeDeletePanel()
  }

  private showRenamePanel(e: React.MouseEvent<HTMLAnchorElement>, noteId, noteName) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      selectedNoteId: noteId,
      selectedNoteName: noteName,
      showRenamePanel: true 
    })
  }

  private closeRenamePanel() {
    this.setState({ showRenamePanel: false });
  }

  private renameSelectedNote(e) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.renameNote(this.state.selectedNoteId, this.renameNoteTextField.value)
    this.closeRenamePanel()
  }

  private handleTextFieldChange(value: string): void {
    this.setState({
      newName: value
    })
  }

  private submitRenameForm(event: React.FormEvent<HTMLElement>): void {
    event.preventDefault()
    this.handleTextFieldChange(this.renameNoteTextField.value)
  }

  @autobind
  private getErrorMessage(value: string): string {
    if (value.startsWith('_')) {
      this.setState({
        isNewNameValid: false
      })
      return "You are not allowed to use a underscore as first letter of the note name."
    }
    if (value.length < 2) {
      this.setState({
        isNewNameValid: false
      })
      return `The length of the input value should more than 2, actual is ${value.length}.`
    }
    this.setState({
      isNewNameValid: true
    })
    return ""
  }
/*
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
*/
  @autobind
  private renderItemColumn(item, index, column) {
    var fieldContent = item[column.fieldName]
    switch (column.key) {
      case 'name':
        return <div style={{ width: '500px'}}>
          <a href="#" onClick={ e => this.loadNote(e, item.id) }>
            <strong>{this.getShortname(item.name)}</strong>
          </a>
        </div>
      case 'rename':
        return <a href="#" onClick={ e => this.showRenamePanel(e, item.id, item.name) }>rename</a>
      case 'delete':
        return  <a href="#" onClick={ e => this.showDeletePanel(e, item.id, item.name) }>delete</a>
      default:
        return <span>{ fieldContent }</span>
    }
  }

  @autobind
  private getShortname(name) {
    var splits = name.split('/')
    if (splits.length > 1) return splits[1]
    return name
  }

  @autobind
  private _onRenderCell(nestingDepth: number, item: any, itemIndex: number) {
    return (
      <DetailsRow
        columns={ this.columns }
        groupNestingDepth={ nestingDepth }
        item={ item }
        itemIndex={ itemIndex }
        selection={ this._selection }
        selectionMode={ SelectionMode.multiple }
        onRenderItemColumn={ this.renderItemColumn }
        />
    )
  }

}
