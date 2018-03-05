import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { DefaultButton, PrimaryButton, CompoundButton } from 'office-ui-fabric-react/lib/Button'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { connect } from 'react-redux'
import NotebookApi from './../../api/notebook/NotebookApi'
import Dropzone from 'react-dropzone'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { toastr } from 'react-redux-toastr'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NotesList extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private renameNoteTextField: TextField
  private selectionTextField: TextField
  private selection: Selection = new Selection({
    onSelectionChanged: () => this.setState({ selectionDetails: this.getSelectionDetails() })
  })
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
    selectionDetails: this.getSelectionDetails(),
    drops: []
  }

  constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.renderItemColumn = this.renderItemColumn.bind(this)
  }

  public render() {
    var { notes, selectedNotes, selectionDetails, drops } = this.state
    return (
      <div>
{/*
        <div>{ selectionDetails }</div>
*/}
        <div className="ms-Grid">
 
          <div className="ms-Grid-row">

            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>

              <Dropzone 
                accept="application/json"
                onDrop={ this.onDrop }
                style={{ width: '100%', height: '50px', borderWidth: '2px', borderColor: 'rgb(102, 102, 102)', borderStyle: 'dashed', borderRadius: '5px' }}
                >
                <div className="ms-fontSize-" >Drop a JSON file here (or click and upload) to import a Note.</div>
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

            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>

              <TextField
                ref={ ref => this.selectionTextField = ref }
                onChanged={ text => this.setState({ selectedNotes: text ? notes.filter(n => n.name.toLowerCase().indexOf(text) > -1) : notes }) }
              />
      {/*
              <MarqueeSelection selection={ this.selection }>
      */}
                <DetailsList
                  items={ selectedNotes }
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
              {notes && notes.map(n => {
                return (
                  <div key={n.id}>
                    <a href="#"  onClick={ e => this.loadNote(e, n.id) }>{n.name}</a>
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

          </div>

        </div>

      </div>

    )

  }

  public componentDidMount() {
    this.notebookApi.listNotes()
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "NOTES_INFO") {
      var notes = webSocketMessageReceived.data.notes.filter(n => n.name != '_conf')
      this.setState ({
        notes: notes,
        selectedNotes: notes
      })
      this.selectionTextField.setState({
        value: ''
      })
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
      const reader = new FileReader()
      reader.onload = () => {
          const fileAsBinaryString = reader.result
          var note = JSON.parse(fileAsBinaryString)
          console.log('---', note)
          if (note.id) {
            toastr.info("Import", "Importing note " + note.id)
            this.notebookApi.importNote(note)
          } else {
            toastr.warning("Import", "Uploaded file does not have the correct format.")
          }
      }
      reader.onabort = () => console.warn('File reading was aborted.')
      reader.onerror = () => console.warn('File reading has failed.')
      reader.readAsBinaryString(file)
    })
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
//    this.notebookApi.listNotes()
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
//    this.notebookApi.listNotes()
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

  private renderItemColumn(item, index, column) {
    var fieldContent = item[column.fieldName]
    switch (column.key) {
      case 'name':
        return <a href="#" onClick={ e => this.loadNote(e, item.id) }><strong>{item.name}</strong></a>
      case 'rename':
        return <a href="#" onClick={ e => this.showRenamePanel(e, item.id, item.name) }>rename</a>
      case 'delete':
        return  <a href="#" onClick={ e => this.showDeletePanel(e, item.id, item.name) }>delete</a>
      default:
        return <span>{ fieldContent }</span>
    }
  }

}
