import * as React from 'react'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { connect } from 'react-redux'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import * as isEqual from 'lodash.isequal'
import { toastr } from 'react-redux-toastr'
import NotebookApi from './../../api/notebook/NotebookApi'
import history from './../../routes/History'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'

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
    isGoogleAuthenticated: false,
    isMicrosoftAuthenticated: false,
    isTwitterAuthenticated: false,
    note: undefined,
    notes: [],
    noteScratchpadId: '_conf',
    runningParagraphs: [],
    flows: [],
    showNewNotePanel: false,
    newNoteName: "",
    isNewNoteNameValid: false,
    showNewFlowPanel: false,
    newFlowName: "",
    isNewFlowNameValid: false
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

        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              <CommandBar
                isSearchBoxVisible={ this.props.isSearchBoxVisible }
                items={ this.leftItems }
                farItems={ this.rightItems }
                className={ styles.commandBarBackgroundTransparentLarge }
              />
            </div>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 ms-textAlignRight">
              <SearchBox
                onFocus={ () => toastr.warning('Search is not available', 'Looks like you are eager for the next release...') }
                onBlur={ () => console.log('onBlur called') }
                underlined={ true }
              />
            </div>
          </div>
        </div>

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
            <br/>
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
            <br/>
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

  public componentDidMount() {
    this.notebookApi.listNotes()
    this.notebookApi.listFlows()
  }

  public componentWillReceiveProps(nextProps) {
    const { config, isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated, webSocketMessageReceived, note, runningParagraphs } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
    if (! this.state.isGoogleAuthenticated != isGoogleAuthenticated) {
      this.setState({
        isGoogleAuthenticated: isGoogleAuthenticated
      })
    }
    if (! this.state.isMicrosoftAuthenticated != isMicrosoftAuthenticated) {
      this.setState({
        isMicrosoftAuthenticated: isMicrosoftAuthenticated
      })
    }
    if (! this.state.isTwitterAuthenticated != isTwitterAuthenticated) {
      this.setState({
        isTwitterAuthenticated: isTwitterAuthenticated
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
      this.notebookApi.showNoteLayout(noteId, 'lines')
    }
    if (webSocketMessageReceived && webSocketMessageReceived.op == "NOTES_INFO") {
      let notes = webSocketMessageReceived.data.notes
      this.setState({
        notes: this.asNotes(notes)
      })
    }
    if (webSocketMessageReceived && webSocketMessageReceived.op == "SAVE_FLOWS") {
      let flows = webSocketMessageReceived.data.flows
      this.setState({
        flows: this.asFlows(flows)
      })
    }
  }

  private runNote() {
    this.props.dispatchRunNoteAction(this.state.note.id, '')
  }

  private asNotes(notes) {
    var ns = []
    ns.push({
      key: 'new-note',
      name: 'New note...',
      icon: 'QuickNote',
      onClick: () => this.setState({ showNewNotePanel: true })
    })
    notes.map(n => {
      var id = n.id
      if (n.name != '_conf') {
        var note = { 
          key: id,
          name: n.name,
          onClick: () => this.notebookApi.showNoteLayout(id, 'lines')
        }
        ns.push(note)
      }
    })
    return ns
  }

  private asFlows(flows) {
    var fl = []
    fl.push(
      {
        key: 'new-flow',
        name: 'New flow...',
        icon: 'Flow',
        onClick: () => this.setState({ showNewFlowPanel: true })
      })
    flows.map(f => {
      var flow = { 
        key: f.id,
        name: f.name,
        onClick: () => this.notebookApi.getFlow(f.id)
      }
      fl.push(flow)
    })
    return fl
  }

  private updateMenu() {
    const {note, runningParagraphs} = this.state
    this.leftItems = [
      {
        key: 'board',
        icon: 'ViewDashboard',
        title: 'Board',
        onClick: () => history.push(`/dla/board`)
      },
      {
        key: 'tiles',
        icon: 'Tiles',
        title: 'Notes Tiles View',
        onClick: () => history.push(`/dla/notes/tiles`)
      },
      {
        key: 'list',
        icon: 'ViewList',
        title: 'Notes List View',
        onClick: () => history.push(`/dla/notes/list`)
      },
      {
        key: 'flows',
        name: 'Flows',
        icon: 'Flow',
        items: this.state.flows
      },      
      {
        key: 'notes',
        name: 'Notes',
        icon: 'ReadingMode',
        items: this.state.notes
      },
      {
        key: 'calendar',
        icon: 'Calendar',
        title: 'Calendar',
        onClick: () => history.push(`/dla/calendar`)
      },
      {
        key: 'people',
        icon: 'People',
        title: 'Users',
        onClick: () => history.push(`/dla/users`)
      },
      {
        key: 'profile',
        icon: 'Accounts',
        title: 'Profile',
        onClick: () => history.push(`/dla/profile`)
      },
      {
        key: 'settings',
        icon: 'Settings',
        title: 'Settings',
        onClick: () => history.push(`/dla/settings`)
      },
      {
        key: 'docs',
        icon: 'Documentation',
        title: 'Documentation',
        onClick: () => history.push(`/dla/docs`)
      },
      {
        key: 'Scratchpad',
        icon: 'NoteForward',
        title: 'Code Scratchpad',
        onClick: () => this.notebookApi.showNoteScratchpad(this.state.noteScratchpadId)
      },
      this.runIndicator
    ]
    if (window.location.hash.replace(/\/$/, '').indexOf("dla/note/") != -1) {
      this.leftItems.push(
        {
          key: 'CollapseMenu',
          icon: 'CollapseMenu',
          title: 'Note Lines Layout',
          onClick: () => this.notebookApi.showNoteLayout(this.state.note.id, 'lines')
        })
/*
        {
          key: 'Tiles2',
          icon: 'Tiles2',
          title: 'Note Tiles Layout',
          onClick: () => this.notebookApi.showNoteLayout(this.state.note.id, 'tiles')
        },
*/
      this.leftItems.push(
        {
          key: 'SingleColumn',
          icon: 'SingleColumn',
          title: 'Note Results Layout',
          onClick: () => this.notebookApi.showNoteLayout(this.state.note.id, 'results')
        })
    }
    if (window.location.hash.replace(/\/$/, '').indexOf("dla/note/") != -1) {
      this.rightItems = [
      ]
    }
    else {
      this.rightItems = [
      ]
    }
  }

  private updateRunIndicator() {
    const {note, runningParagraphs} = this.state
//    let isNoteRunning = runningParagraphs.length > 0
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
