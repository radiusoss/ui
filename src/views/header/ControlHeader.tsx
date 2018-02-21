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
import NotebookApi from './../../api/notebook/NotebookApi'
import FabricIcon from '../../components/FabricIcon'
import history from './../../history/History'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'
import { SwatchColorPicker } from 'office-ui-fabric-react/lib/SwatchColorPicker'
import GoogleProfileWidget from './../profile/GoogleProfileWidget'
import ClusterCapacity from './../cluster/ClusterCapacity'
import ClusterUsage from './../cluster/ClusterUsage'
import ClusterHealth from './../cluster/ClusterHealth'
import ClusterReservations from './../cluster/ClusterReservations'
import HDFStatus from './../hdfs/HDFSStatus'
import SparkStatus from './../spark/SparkStatus'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../network/NetworkStatus'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

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
    statusPanel: '',
    showNewNotePanel: false,
    newNoteName: "",
    isNewNoteNameValid: false,
    showNewFlowPanel: false,
    newFlowName: "",
    isNewFlowNameValid: false,
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob)
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window['NotebookApi']
  }

  public render() {
    const { profilePhoto, statusPanel } = this.state
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
                <SearchBox
                  onFocus={ () => toastr.warning('Search is not available', 'Looks like you are eager for the next release...') }
                  underlined={ true }
                />
              </div>
              <div style={{ float: 'right', padding: '0px 10px' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); this.setState({statusPanel: 'profile'}) }}>
                  <Persona
                    imageUrl = { profilePhoto }
                    hidePersonaDetails = { true }
                    presence = { PersonaPresence.online }
                    size = { PersonaSize.extraSmall }
                    className = "text-center"
                  />
                </a>
              </div>
              <div style={{ float: 'right' }}>
                <SwatchColorPicker
                  columnCount={ 8 }
                  cellShape={ 'circle' }
                  colorCells={
                    [
                      { id: 'cluster-capacity', label: 'Cluster Capacity', color: 'green' },
                      { id: 'cluster-usage', label: 'Cluster Usage', color: 'green' },
                      { id: 'cluster-health', label: 'Cluster Health', color: 'green' },
                      { id: 'reservations', label: 'Reservations', color: 'yellow' },
                      { id: 'hdfs', label: 'HDFS Status', color: 'green' },
                      { id: 'interpreters', label: 'Interpreter Status', color: 'red' },
                      { id: 'spark', label: 'Spark Status', color: 'yellow' },
                      { id: 'network', label: 'Network Status', color: 'green' }
                    ]
                  }
                  onCellFocused={(id?: string, color?: string) => {
                    if (id) {
                      this.setState({
                        statusPanel: id
                      })
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Panel
          isOpen={ statusPanel != '' }
          type={ PanelType.medium }
          onDismiss={() => this.setState({statusPanel: ''})}
        >
        <div>
          {(statusPanel == 'profile') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Accounts" /> Profile</div>
            <GoogleProfileWidget/>
          </div>
          }
          {(statusPanel == 'cluster-capacity') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="CircleFill" /> Cluster Capacity</div>
            <ClusterCapacity/>
          </div>
          }
          {(statusPanel == 'cluster-usage') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Frigid" /> Cluster Usage</div>
            <ClusterUsage/>
          </div>
          }
          {(statusPanel == 'cluster-health') &&
          <div>
             <div className="ms-font-su"><FabricIcon name="Health" /> Cluster Health</div>
             <ClusterHealth/>
          </div>
          }
          {(statusPanel == 'reservations') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Calendar" /> Reservations</div>
            <ClusterReservations/>
          </div>
          }
          {(statusPanel == 'hdfs') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="OfflineStorageSolid" /> HDFS</div>
            <HDFStatus/>
          </div>
          }
          {(statusPanel == 'interpreters') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Light" /> Interpreters</div>
            <SpitfireInterpretersStatus/>
          </div>
          }
          {(statusPanel == 'spark') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="LightningBolt" /> Spark</div>
            <SparkStatus/>
          </div>
          }
          {(statusPanel == 'network') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="NetworkTower" /> Network</div>
            <NetworkStatus/>
          </div>
          }
         </div>
        </Panel>
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
    this.props.dispatchRunNoteAction(this.state.note.id)
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
          {
            key: 'budget',
            name: 'Budget',
            icon: 'Money',
            title: 'Budget',
            onClick: () => history.push(`/dla/kuber/budget`)
          },
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
