import * as React from 'react'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { connect } from 'react-redux'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import * as isEqual from 'lodash.isequal'
import { toastr } from 'react-redux-toastr'
import { NotebookStore } from './../../store/NotebookStore'
import IndicatorHeader from './IndicatorHeader'
import { stripString } from './../../util/Utils'
import NotebookApi from './../../api/notebook/NotebookApi'
import FabricIcon from '../../components/FabricIcon'
import history from './../../history/History'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

const SCRATCHPAD_PREFIX = '_SCRATCHPAD_'

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ControlHeader extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private notebookApi: NotebookApi
  private newNoteTextField: TextField
  private newFlowTextField: TextField
  private runIndicator: any = {}
  private leftItems: any[] = [{}]
  private rightItems: any[] = [{}]

  state = {
    isMicrosoftAuthenticated: false,
    note: undefined,
    notes: [],
    scratchpadNoteId: '',
    notesMenuItems: [{
      key: 'new-note',
      name: 'New note...',
      icon: 'QuickNote',
      onClick: () => this.setState({ showNewNotePanel: true })
    }],
    flows: [],
    flowsMenuItems: [{
      key: 'new-flow',
      name: 'New flow...',
      icon: 'Flow',
      onClick: () => this.setState({ showNewFlowPanel: true })
    }],
    showNewNotePanel: false,
    newNoteName: '',
    isNewNoteNameValid: false,
    showNewFlowPanel: false,
    newFlowName: '',
    isNewFlowNameValid: false
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    this.updateRunIndicator()
    this.updateMenu()
    return (
      <div style = {{ backgroundColor: "white !important"}} >
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <CommandBar
                isSearchBoxVisible={ this.props.isSearchBoxVisible }
                items={ this.leftItems }
                farItems={ this.rightItems }
                className={ styles.commandBarBackgroundTransparentLarge }
              />
            </div>
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <div style={{ float: 'left' }}>
{/*
                <SearchBox
                  onFocus={ () => toastr.warning('Search is not available', 'Looks like you are eager for the next release...') }
                  underlined={ true }
                />
*/}
                </div>
              <div style={{ float: 'right' }}>
                <IndicatorHeader/>
              </div>
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
    this.notebookApi = window['NotebookApi']
  }

  public componentWillReceiveProps(nextProps) {
    const { config, isMicrosoftAuthenticated, spitfireMessageReceived, note } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.notebookApi.listNotes()
      this.notebookApi.listFlows()
    }
    if (! this.state.isMicrosoftAuthenticated != isMicrosoftAuthenticated) {
      this.setState({
        isMicrosoftAuthenticated: isMicrosoftAuthenticated
      })
    }
    if (note.id && (! isEqual(note, this.props.note))) {
      this.setState({
        note: note
      })
    }
    if (spitfireMessageReceived && spitfireMessageReceived.op == "NEW_NOTE") {
      var noteId = spitfireMessageReceived.data.note.id
      if (spitfireMessageReceived.data.note.name != this.getScratchpadNoteName()) {
        this.notebookApi.showNoteLayout(noteId, 'workbench')
      }
      if (spitfireMessageReceived.data.note.name != this.getScratchpadNoteName()) {
        NotebookStore.state().scratchpadNoteId = noteId
        this.setState({
          scratchpadNoteId: noteId
        })
      }
      this.notebookApi.listNotes()
      var user = "anonymous"
      var perms = {
        readers: [user],
        owners: [user],
        writers: [user],
        runners: [user]
      }
      this.notebookApi.putNotePermissions(noteId, perms)
    }
    if (spitfireMessageReceived && spitfireMessageReceived.op == "NOTES_INFO") {
      var scratchpadNoteId = ""
      spitfireMessageReceived.data.notes.forEach(n => {
        if (n.name == this.getScratchpadNoteName()) {
          scratchpadNoteId = n.id
        }
      })
      if (scratchpadNoteId == '') {
        this.notebookApi.newNote(this.getScratchpadNoteName())
      }
      var notes = spitfireMessageReceived.data.notes.filter(n => !n.name.startsWith('_'))
      NotebookStore.state().scratchpadNoteId = scratchpadNoteId
      this.setState({
        notes: notes,
        scratchpadNoteId: scratchpadNoteId,
        notesMenuItems: this.asNotesMenuItems(notes)
      })
    }
    if (spitfireMessageReceived && spitfireMessageReceived.op == "PARAGRAPH") {
      if (this.state.scratchpadNoteId == '') {
        var p = spitfireMessageReceived.data.paragraph
        if (p.name == NotebookStore.state().profilePrincipal) {
          NotebookStore.state().scratchpadNoteId = p.id
          this.setState({
            scratchpadNoteId: p.id
          })
          this.notebookApi.getInterpreterBindings(p.name)          
        }
      }
    }
    if (spitfireMessageReceived && (spitfireMessageReceived.op == "INTERPRETER_BINDINGS")) {
      var ids = spitfireMessageReceived.data.interpreterBindings.map(intBind => {return intBind.id})
      this.notebookApi.saveInterpreterBindings(this.state.scratchpadNoteId, ids)
    }
    if (spitfireMessageReceived && spitfireMessageReceived.op == "SAVE_FLOWS") {
      var flows = spitfireMessageReceived.data.flows
      this.setState({
        flows: flows,
        flowsMenuItems: this.asFlowsMenuItems(flows)
      })
    }
  }

  private runNote() {
    this.props.dispatchRunNoteAction(this.state.note.id)
  }

  private asNotesMenuItems(notes) {
    var ns = []
    ns.push({
      key: 'new-note',
      name: 'New note...',
      icon: 'QuickNote',
      onClick: () => this.setState({ showNewNotePanel: true })
    })
    var previousIndex = 0
    var folder = ''
    var items = new Array<any>()
    notes.map( note => {
      var name = note.name
      var id = note.id
      var splits = name.split("/")
      var nextFolder = ''
      if (splits.length > 1) {
        nextFolder = splits[0]
      }
      if (folder != nextFolder) {
        if (folder == '') {
          items.map(i => ns.push(i))
        }
        else {
          ns.push({
            key: folder + '-' + id,
            name: folder,
            items: items
          })
        }
        items = new Array<any>()
      }
      items.push({
        key: 'item-' + id,
        name: this.getShortname(name),
        onClick: () => {
          this.notebookApi.showNoteLayout(id, 'workbench')
        }
      })
      folder = nextFolder
    })
    if (folder == '') {
      items.map(i => ns.push(i))
    }
    else {
      ns.push({
        key: folder + '-',
        name: folder,
        items: items
      })
    }
    ns.push({
      key: 'list',
      name: 'Notes List',
      icon: 'ViewList',
      title: 'Notes List View',
      onClick: () => history.push(`/dla/explorer/notes/list`)
    })
    ns.push({
      key: 'history',
      name: 'History',
      icon: 'GitGraph',
      title: 'History',
      onClick: () => history.push(`/dla/explorer/history`)
    })
    return ns
  }

  private asFlowsMenuItems(flows) {
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
    const {note} = this.state
    this.leftItems = [
      {
        key: 'home',
        name: '',
        icon: 'Home',
        title: 'Home Page',
        onClick: () => history.push(`/dla/home`)
      },
      {
        key: 'kuber',
        name: 'Kuber',
//        icon: 'EngineeringGroup',
        title: 'Kuber',
        items: [
          {
            key: 'calendar',
            name: 'Reservations',
            icon: 'Calendar',
            title: 'Reservations',
            onClick: () => history.push(`/dla/kuber/reservations`)
          },
          {
            key: 'people',
            name: 'Users',
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
            key: 'status',
            name: 'Status',
            icon: 'AutoRacing',
            title: 'Status',
            onClick: () => history.push(`/dla/kuber/status`)
          },
 /*
          {
            key: 'budget',
            name: 'Budget',
            icon: 'Money',
            title: 'Budget',
            onClick: () => history.push(`/dla/kuber/budget`)
          },
*/
            {
            key: 'settings',
            name: 'Settings',
            icon: 'Settings',
            title: 'Settings',
            onClick: () => history.push(`/dla/kuber/settings`)
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
        icon: '',
        items: this.state.notesMenuItems
      },
/*
      {
        key: 'flows',
        name: 'Flows',
        icon: 'Flow',
        items: this.state.flows
      },
*/
      {
        key: 'Scratchpad',
        icon: 'NoteForward',
        title: 'Scratchpad',
        onClick: () => history.push('/dla/explorer/scratchpad')
      }
    ]
    if (this.runIndicator.key) {
      this.leftItems.push(this.runIndicator)
    }
    if (window.location.hash.replace(/\/$/, '').indexOf("dla/explorer/scratchpad") != -1) {
      this.leftItems.push(
        {
          key: 'clear',
          icon: 'ClearFormatting',
          title: 'Clear Scratchpad',
          onClick: () => this.props.dispatchClearScratchpadAction()
        }
      )
    }
    if (window.location.hash.replace(/\/$/, '').indexOf("dla/explorer/note/") != -1) {
      this.leftItems.push(
        {
          key: 'SingleColumn',
          icon: 'SingleColumn',
          title: 'Note Results Layout',
          onClick: () => this.notebookApi.showNoteLayout(this.state.note.id, 'cover')
        }
      )
    }
  }

  private updateRunIndicator() {
    const {note} = this.state
    if (
       (window.location.hash.replace(/\/$/, '').indexOf("dla/explorer/note/") == -1)
       &&
       (window.location.hash.replace(/\/$/, '').indexOf("dla/explorer/scratchpad") == -1)
    )
    {
      this.runIndicator = {}
      return
    }
    if (note) {
      if (note.name != this.state.scratchpadNoteId) {
        this.runIndicator = {
          key: 'run-indicator',
          name: stripString(this.getShortname(note.name), 8),
          icon: 'Play',
          title: 'Run [SHIFT+Enter] ' + this.getShortname(note.name),
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

  @autobind
  private getShortname(name) {
    if (name.startsWith(SCRATCHPAD_PREFIX)) {
      return 'Scratchpad'
    }
    var splits = name.split('/')
    if (splits.length > 1) return splits[1]
    return name
  }

  private getScratchpadNoteName() {
    return SCRATCHPAD_PREFIX + NotebookStore.state().profilePrincipal    
  }

}
