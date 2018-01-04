import * as React from 'react'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { connect } from 'react-redux'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import * as isEqual from 'lodash.isequal'
import NotebookApi from './../../api/notebook/NotebookApi'
import history from './../../routes/History'
import { IConfig, emptyConfig } from './../../config/Config'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'

import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NotebookControlBar extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private notebookApi: NotebookApi
  private newNoteTextField: TextField
  private newFlowTextField: TextField
  private runIndicator: any = {}
  private leftItems: any[] = [{}]
  private rightItems: any[] = [{}]

  state = {
    showNewNotePanel: false,
    newNoteName: "",
    isNewNoteNameValid: false,
    showNewFlowPanel: false,
    newFlowName: "",
    isNewFlowNameValid: false,
    note: undefined,
    runningParagraphs: [],
    notes: [],
    isAadAuthenticated: false
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window['NotebookApi']
  }

  public render() {

    this.updateRunIndicator()
    this.updateMenu()

    return (

      <div style = {{ backgroundColor: "white !important"}} >

        <CommandBar
          isSearchBoxVisible={ this.props.isSearchBoxVisible }
          items={ this.leftItems }
          farItems={ this.rightItems }
          className={ styles.commandBarBackground }
        />

        <Panel
          isOpen={ this.state.showNewNotePanel }
          type={ PanelType.smallFixedNear }
          onDismiss={ () => this.setState({ showNewNotePanel: false }) }
          headerText='Create a note'
        >
          <form onSubmit={e => this.submitNewNote(e) }>
            <TextField
              onChanged={ v => this.handleNewNoteTextFieldChange(v) }
              ref={ ref => this.newNoteTextField = ref }
              onGetErrorMessage={ v => this.getNewNoteErrorMessage(v) }
              iconClass='ms-Icon--QuickNote ms-Icon'
            />
            <PrimaryButton
              text='Create Note'
              disabled={ !this.state.isNewNoteNameValid }
              onClick={ () => this.createNote() }
            />
          </form>
        </Panel>

        <Panel
          isOpen={ this.state.showNewFlowPanel }
          type={ PanelType.smallFixedNear }
          onDismiss={ () => this.setState({ showNewFlowPanel: false }) }
          headerText='Create a flow'
        >
          <form onSubmit={e => this.submitNewFlow(e) }>
            <TextField
              placeholder='Name of the new flow'
              autoFocus={ true }
              onChanged={ v => this.handleNewFlowTextFieldChange(v) }
              ref={ ref => this.newFlowTextField = ref }
              onGetErrorMessage={ v => this.getNewFlowErrorMessage(v) }
              iconClass='ms-Icon--Flow ms-Icon'
            />
            <PrimaryButton
              text='Create Flow'
              disabled={ !this.state.isNewFlowNameValid }
              onClick={ () => this.createFlow() }
            />
          </form>
        </Panel>

      </div>

    )

  }

  public componentWillReceiveProps(nextProps) {

    const { config, isAadAuthenticated,  webSocketMessageReceived, note, runningParagraphs } = nextProps

    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
/*
    if (!this.state.isAadAuthenticated && isAadAuthenticated) {
      console.log("auth", this.state.isAadAuthenticated, isAadAuthenticated)
//      this.notebookApi.listNotes()
    }
*/
    if (! this.state.isAadAuthenticated != isAadAuthenticated) {
      this.setState({
        isAadAuthenticated: isAadAuthenticated
      })
    }

    if (note.id && (! isEqual(note, this.props.note))) {
      this.setState({
        note: note
      })
    }

    if (! isEqual(runningParagraphs, this.props.runningParagraphs)) {
      this.setState({
        runningParagraphs: runningParagraphs
      })
    }

    if (webSocketMessageReceived && webSocketMessageReceived.op == "NEW_NOTE") {
      this.notebookApi.listNotes()
      let noteId = webSocketMessageReceived.data.note.id
      this.notebookApi.getNote(noteId)
      history.push(`/dla/note/${noteId}`)
    }

    if (webSocketMessageReceived && webSocketMessageReceived.op == "NOTES_INFO") {
      let notes = webSocketMessageReceived.data.notes
      this.setState({
        notes: this.asNotes(notes)
      })
    }

  }

  private asNotes(notes) {
    var ns = []
    notes.map(n => {
      var id = n.id
      var note = { 
        key: id,
        name: n.name,
        onClick: () => this.notebookApi.getNote(id)
      }
      ns.push( note )
    })
    return ns
  }

  private updateRunIndicator() {

    const {note, runningParagraphs} = this.state

    let isNoteRunning = runningParagraphs.length > 0

    if (window.location.hash.replace(/\/$/, '').indexOf("dla/note/") == -1) {
/*
      if (isNoteRunning) {
        this.runIndicator = {
          key: 'run-indicator',
          name: 'Running',
          icon: 'Running',
          onClick: () => {
            this.notebookApi.getNote(runningNote.id)
          }
        }
        return
      }
*/
      this.runIndicator = {}
      return
    }

    if (!note) {
      this.runIndicator = {
        key: 'run-indicator',
        name: 'Run',
        icon: 'Play',
        title: 'Run the note [SHIFT+Enter]',
        onClick: () => this.runNote()
      }
      return
    }
/*
    if (runningNote) {
      if (note.id == runningNote.id) {
        this.runIndicator = {
          key: 'run-indicator',
          name: isNoteRunning ? 'Stop' : 'Run',
          icon: isNoteRunning ? 'Location' : 'Play',
          onClick: isNoteRunning ? () => this.stopNote() : () => this.runNote()
        }
        return
      }
    }
    if (isNoteRunning) {
      this.runIndicator = {
        key: 'run-indicator',
        name: 'Running',
        icon: 'Running',
        onClick: () => {
          this.notebookApi.getNote(runningNote.id)
        }
      }
      return
    }
*/
    this.runIndicator = {
      key: 'run-indicator',
      name: note.name,
      icon: 'Play',
      title: 'Run the note [SHIFT+Enter]',
      onClick: () => this.runNote()
    }

  }

  private updateMenu() {
    this.leftItems = [
      {
        key: 'notes',
        name: 'Notes',
        icon: 'ReadingMode',
        items: this.state.notes
      },
      {
        key: 'new-note',
        name: 'Note',
        icon: 'QuickNote',
        onClick: () => this.setState({ showNewNotePanel: true })
      },
      {
        key: 'new-flow',
        name: 'Flow',
        icon: 'Flow',
        onClick: () => this.setState({ showNewFlowPanel: true })
      },
      this.runIndicator
    ]
  }

  private runNote() {
    this.props.dispatchRunNoteAction(this.state.note.id) 
  }

  // --------------------------------------------------------------------------

  private handleNewNoteTextFieldChange(value: string): void {
    this.setState({
      newNoteName: value
    })
  }

  private submitNewNote(event: React.FormEvent<HTMLElement>): void {
    event.preventDefault()
    this.handleNewNoteTextFieldChange(this.newNoteTextField.value)
  }

  @autobind
  private getNewNoteErrorMessage(value: string): string {
    if (value.length > 2) {
        if (this) this.setState({
          isNewNoteNameValid: true
        })
        return ''
      }
      else {
        if (this) this.setState({
          isNewNoteNameValid: false
        })
       return `The length of the note name should more than 2, actual is ${value.length}.`
      }
  }

  private createNote(): void {    
    this.setState({ showNewNotePanel: false })
    this.notebookApi.newNote(this.newNoteTextField.value)
  }

  // --------------------------------------------------------------------------

  private handleNewFlowTextFieldChange(value: string): void {
    this.setState({
      newFlowName: value
    })
  }

  private submitNewFlow(event: React.FormEvent<HTMLElement>): void {
    event.preventDefault()
    this.handleNewFlowTextFieldChange(this.newFlowTextField.value)
  }

  @autobind
  private getNewFlowErrorMessage(value: string): string {
    if (value.length > 2) {
        if (this) this.setState({
          isNewFlowNameValid: true
        })
        return ''
      }
      else {
        if (this) this.setState({
          isNewFlowNameValid: false
        })
       return `The length of the flow name should more than 2, actual is ${value.length}.`
      }
  }

  private createFlow(): void {    
    this.setState({ showNewFlowPanel: false })
    this.notebookApi.newFlow(this.newFlowTextField.value)
  }

}
