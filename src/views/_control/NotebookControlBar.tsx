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
import history from './../../history/History'
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
    notes: [{
      key: 'new-note',
      name: 'New note...',
      icon: 'QuickNote',
      onClick: () => this.setState({ showNewNotePanel: true })
    }],
    noteScratchpadId: '_conf',
    runningParagraphs: [],
    flows: [{
      key: 'new-flow',
      name: 'New flow...',
      icon: 'Flow',
      onClick: () => this.setState({ showNewFlowPanel: true })
    }],
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
{/*
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 ms-textAlignRight">
              <SearchBox
                onFocus={ () => toastr.warning('Search is not available', 'Looks like you are eager for the next release...') }
                onBlur={ () => console.log('onBlur called') }
                underlined={ true }
              />
            </div>
*/}
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
  }

  public componentWillReceiveProps(nextProps) {
    const { config, isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated, webSocketMessageReceived, note, runningParagraphs } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.notebookApi.listNotes()
      this.notebookApi.listFlows()
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
      var noteId = webSocketMessageReceived.data.note.id
      this.notebookApi.showNoteLayout(noteId, 'workbench')
    }
    if (webSocketMessageReceived && webSocketMessageReceived.op == "NOTES_INFO") {
      var notes = webSocketMessageReceived.data.notes
      this.setState({
        notes: this.asNotes(notes)
      })
    }
    if (webSocketMessageReceived && webSocketMessageReceived.op == "SAVE_FLOWS") {
      var flows = webSocketMessageReceived.data.flows
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
          onClick: () => this.notebookApi.showNoteLayout(id, 'workbench')
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
        key: 'home',
        name: 'Home',
        icon: 'Home',
        title: 'Home',
        onClick: () => history.push(`/dla/home`)
      },
      {
        key: 'notes',
        name: 'Notes',
        icon: 'ReadingMode',
        items: this.state.notes
      },
      {
        key: 'flows',
        name: 'Flows',
        icon: 'Flow',
        items: this.state.flows
      },      
      {
        key: 'kuber',
        name: 'Kuber',
//        icon: 'EngineeringGroup',
        title: 'Kuber',
        items: [
          {
            key: 'calendar',
            name: 'Calendar',
            icon: 'Calendar',
            title: 'Calendar',
            onClick: () => history.push(`/dla/kuber/calendar`)
          },
          {
            key: 'people',
            name: 'People',
            icon: 'People',
            title: 'Users',
            onClick: () => history.push(`/dla/kuber/users`)
          },
          {
            key: 'profile',
            name: 'Profile',
            icon: 'Accounts',
            title: 'Profile',
            onClick: () => history.push(`/dla/kuber/profile`)
          },
          {
            key: 'settings',
            name: 'Settings',
            icon: 'Settings',
            title: 'Settings',
            onClick: () => history.push(`/dla/kuber/settings`)
          },
          {
            key: 'costs',
            name: 'Costs',
            icon: 'Money',
            title: 'Costs',
            onClick: () => history.push(`/dla/kuber/costs`)
          }
/*
          {
            key: 'docs',
            name: 'Documentation',
            icon: 'Documentation',
            title: 'Documentation',
            onClick: () => history.push(`/dla/support/docs`)
          },
          {
            key: 'help',
            name: 'Help',
            icon: 'Help',
            title: 'Help',
            onClick: () => history.push(`/dla/support/help`)
          }
*/
        ]
      },
      {
        key: 'explorer',
        name: 'Explorer',
//        icon: 'BarChart4',
        title: 'Explorer',
        items: [
/*
          {
            key: 'notebook-cover',
            name: 'Notebook Cover',
            icon: 'Tiles',
            title: 'Notebook Cover View',
            onClick: () => history.push(`/dla/explorer/notes/cover`)
          },
*/
          {
            key: 'list',
            name: 'Notes List',
            icon: 'ViewList',
            title: 'Notes List View',
            onClick: () => history.push(`/dla/explorer/notes/list`)
          },
          {
            key: 'history',
            name: 'History',
            icon: 'GitGraph',
            title: 'History',
            onClick: () => history.push(`/dla/explorer/history`)
          }
        ]
      },
      {
        key: 'Scratchpad',
        icon: 'NoteForward',
        title: 'Scratchpad',
        onClick: () => this.notebookApi.showNoteScratchpad(this.state.noteScratchpadId)
      },
      this.runIndicator
    ]
    if (window.location.hash.replace(/\/$/, '').indexOf("dla/explorer/note/") != -1) {
      if (window.location.hash.replace(/\/$/, '').indexOf("dla/explorer/scratchpad") == -1) {
        this.leftItems.push(
          {
            key: 'SingleColumn',
            icon: 'SingleColumn',
            title: 'Note Results Layout',
            onClick: () => this.notebookApi.showNoteLayout(this.state.note.id, 'cover')
          }
        )
      }
      else {
        this.leftItems.push(
          {
            key: 'clear',
            icon: 'ClearFormatting',
            title: 'Clear Scratchpad',
            onClick: () => this.props.dispatchClearScratchpadAction()
          }
        )
      }
    }
  }

  private updateRunIndicator() {
    const {note, runningParagraphs} = this.state
    if (window.location.hash.replace(/\/$/, '').indexOf("dla/explorer/note/") == -1) {
      this.runIndicator = {}
      return
    }
    if (note) {
      if (note.name != this.state.noteScratchpadId) {
        this.runIndicator = {
          key: 'run-indicator',
          name: note.name,
          icon: 'Play',
          title: 'Run the note [SHIFT+Enter]',
          onClick: () => this.runNote()
          }
      }
      else {
        this.runIndicator = {
          key: 'run-indicator',
          name: 'Scratchpad',
          icon: 'Play',
          title: 'Run Scratchpad [SHIFT+Enter]',
          onClick: () => this.runNote()
        }
      }
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
