import * as React from 'react'
import * as stream from 'stream'
import * as isEqual from 'lodash.isequal'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import ReconnectingWebSocket from './../../util/websocket/ReconnectingWebSocket'
import { NotebookStore } from './../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'

const SHARED_PASSWORD = 'spitfire-shared'

export interface BooleanResponse {
  boolean: boolean
}

export interface SpitfireResponse {
  status?: string
  message?: string
  body?: SpitfireBody | string | any
}

export interface SpitfireBody {
  principal?: string
  ticket?: string
  roles?: [string]
}

export interface ISpitfireApi {
  ping(): void
  login(userName, password): Promise<Result<SpitfireResponse>>
  ticket(): Promise<Result<SpitfireResponse>>
  version(): Promise<Result<SpitfireResponse>>
  newNote(name: string): void
  cloneNote(id: string, name: string): void
  importNote(note: any): void
  listNotes(): void
  getNote(id: string): void
  checkpointNote(noteId: string, message: string): void
  renameNote(id: string, newName: string)
  moveNoteToTrash(id: string): void
  deleteNote(id: string): void
  runAllParagraphs(id: string, paragraphs: any[])
  runAllParagraphsSpitfire(id: string, paragraphs: any[])
  runParagraph(paragraph: any, code: string)
  cancelParagraph(id: string)
  restartInterpreter(id: string)
  listConfigurations()
  interpreterSetting()
  addUsers(users: any): void
  removeUsers(users: any): void
  listUsers(): void
  newFlow(name: string): void
  saveFlow(flow: any): void
  saveFlows(flows: any): void
  saveLayout(layout: any): void
  listFlows(): void
  getFlow(id: string): void
  renameFlow(id: string, newName: string)
  moveFlowToTrash(id: string): void
  deleteFlow(id: string): void
  runFlow(id: string)
  configuration(): any
  commitParagraph(p: any): void
  commitParagraphWithGraph(p: any, graph: any): void
  insertParagraph(index: number): void
  moveParagraph(paragraphId: string, index: number): void
  removeParagraph(paragraphId: string): void
  clearParagraphOutput(paragraphId: string): void
  getInterpreterBindings(noteId: string): any
  saveInterpreterBindings(noteId: string, interpreterIds: [string]): void
  getNotePermissions(noteId: string): any
  putNotePermissions(noteId: string, permissions: any): void
}

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SpitfireApi extends React.Component<any, any>  implements ISpitfireApi {
  private config: IConfig = emptyConfig
  private restClient: RestClient = null

  private webSocketClient: ReconnectingWebSocket
  private flows = []

  state = {
    isGoogleAuthenticated: false,
    isMicrosoftAuthenticated: false,
    isTwitterAuthenticated: false,
    webSocketHealthy: false
  }
  
  public constructor(props) {    
    super(props)
    window['SpitfireApi'] = this
  }
  
  public render() {
    return <div>{ this.props.children }</div>
  }

  public componentWillReceiveProps(nextProps) {
    const { isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated, config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.webSocketClient = new ReconnectingWebSocket(this.config.spitfireWs + '/spitfire/ws')
      this.webSocketClient.onopen = (event: MessageEvent) => {
        console.log("Spitfire WebSocket has been opened.");
        toastr.success('Spitfire', 'Connected to Spitfire Server.')
        this.setState({
          webSocketHealthy: true
        })
      }
      this.webSocketClient.onmessage = (event: MessageEvent) => {
        var message = JSON.parse(event.data)
        console.log('Spitfire Receive << %o, %o', message.op, message)
        this.props.dispatchWsMessageReceivedAction(message)
        this.setState({
          webSocketHealthy: true
        })
      }
      this.webSocketClient.onerror = (event: MessageEvent) => {
        console.log("Spitfire WebSocket Error: " + event.data)
        toastr.error('Issue while connecting to Spitfire', 'Check your network and/or force reload your browser.')
        this.setState({
          webSocketHealthy: false
        })
      }
      this.webSocketClient.onclose = (event: CloseEvent) => {
        var code = event.code
        console.log("Spitfire WebSocket Closed: " + code)
        if (code != 1001) {
          toastr.warning('Spitfire Connection closed', 'Spitfire Server is not reachable - Ensure it is online and your network is available, then reload your browser [' + code + ']')
        }
        this.setState({
          webSocketHealthy: false
        })
      }
      setInterval( _ => {
        this.ping()
      }, 10000 )
      this.newRestClient(this.principalValue())
    }
    this.setState({
      isGoogleAuthenticated: isGoogleAuthenticated,
      isMicrosoftAuthenticated: isMicrosoftAuthenticated,
      isTwitterAuthenticated: isTwitterAuthenticated
    })
  }

  public newRestClient(username: string) {
    this.restClient = new RestClient({
      name: 'SpitfireApi',
      url: this.config.spitfireRest,
      path: '/spitfire/api',
      username: username,
      password: SHARED_PASSWORD
    })

  }

// ----------------------------------------------------------------------------

  public async login(userName, password): Promise<Result<SpitfireResponse>> {
    password = SHARED_PASSWORD
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.postForm<SpitfireResponse>({ userName: userName, password: password }, {}, jsonOpt, "/login")
    )
  }

  public async ticket(): Promise<Result<SpitfireResponse>> {
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.get<SpitfireResponse>({}, jsonOpt, "/security/ticket")
    )
  }

  public async version(): Promise<Result<SpitfireResponse>> {
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.get<SpitfireResponse>({}, jsonOpt, "/version")
    )
  }

  public async restartInterpreter(id: string): Promise<Result<SpitfireResponse>> {
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.put<SpitfireResponse>({}, {}, jsonOpt, `/interpreter/setting/restart/${id}`)
    )
  }

  public async interpreterSetting(): Promise<Result<SpitfireResponse>> {
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.get<SpitfireResponse>({}, jsonOpt, "/interpreter/setting")
    )
  }

  public async configuration(): Promise<Result<SpitfireResponse>> {
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.get<SpitfireResponse>({}, jsonOpt, "/configurations/all")
    )
  }

  public async getNotePermissions(noteId: string): Promise<Result<SpitfireResponse>> {
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.get<SpitfireResponse>({}, jsonOpt, `/notebook/${noteId}/permissions`)
    )
  }

  public async putNotePermissions(noteId: string, permissions: any): Promise<Result<SpitfireResponse>> {
    return this.wrapResult<SpitfireResponse, SpitfireResponse>(
      r => r,
      async () => this.restClient.put<SpitfireResponse>(permissions, {}, jsonOpt, `/notebook/${noteId}/permissions`)
    )
  }

// ----------------------------------------------------------------------------

  public ping(): void {
    this.sendWebSocketMessage(JSON.stringify(this.PING()))
  }

  public newNote(name: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.NEW_NOTE(name)))
  }

  public cloneNote(id: string, name: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.CLONE_NOTE(id, name)))
  }

  public importNote(note: any): void {
    this.sendWebSocketMessage(JSON.stringify(this.IMPORT_NOTE(note)))
  }

  public listNotes(): void {
    this.sendWebSocketMessage(JSON.stringify(this.LIST_NOTES_SPITFIRE()))
  }

  public getNote(id: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.GET_NOTE(id)))
  }

  public checkpointNote(noteId: string, message: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.CHECKPOINT_NOTE(noteId, message)))
  }

  public renameNote(id: string, newName: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.NOTE_RENAME(id, newName)))
  }

  public moveNoteToTrash(id: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.MOVE_NOTE_TO_TRASH(id)))
  }

  public deleteNote(id: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.DEL_NOTE(id)))
  }

  public runAllParagraphs(id: string, paragraphs: any[]): void {
    this.sendWebSocketMessage(JSON.stringify(this.RUN_ALL_PARAGRAPHS(id, paragraphs)))
  }

  public runAllParagraphsSpitfire(id: string, paragraphs: any[]): void {
    this.sendWebSocketMessage(JSON.stringify(this.RUN_ALL_PARAGRAPHS_SPITFIRE(id, paragraphs)))
  }

  public runParagraph(paragraph: any, code: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.RUN_PARAGRAPH(paragraph, code)))
  }

  public cancelParagraph(id: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.CANCEL_PARAGRAPH(id)))
  }

  public listConfigurations(): void {
    this.sendWebSocketMessage(JSON.stringify(this.LIST_CONFIGURATIONS()))
  }

  public addUsers(users: any): void {
    this.sendWebSocketMessage(JSON.stringify(this.ADD_USERS(users)))
  }

  public removeUsers(users: any): void {
    this.sendWebSocketMessage(JSON.stringify(this.REMOVE_USERS(users)))
  }

  public listUsers(): void {
    this.sendWebSocketMessage(JSON.stringify(this.LIST_USERS()))
  }

  public newFlow(name: string): void {
//    this.sendWebSocketMessage(JSON.stringify(this.NEW_FLOW(name)))
    var flow = {
      id: this.ID(),
      name: name,
      dag: {
        "nodes": [],
        "edges": []
      }
    }
    this.flows.push(flow)
    this.saveFlows(this.flows)
  }
  
  public saveFlow(flow: any): void {    
    this.deleteFlow(flow.id)
    this.flows.push(flow)
    this.saveFlows(this.flows)
  }

  public saveFlows(flows: any): void {
    this.sendWebSocketMessage(JSON.stringify(this.SAVE_FLOWS(flows)))
  }

  public saveLayout(layout: any): void {
    this.sendWebSocketMessage(JSON.stringify(this.SAVE_LAYOUT(layout)))
  }

  public listFlows(): void {
    this.sendWebSocketMessage(JSON.stringify(this.LIST_FLOWS()))
  }

  public getFlow(id: string): void {
//    this.sendWebSocketMessage(JSON.stringify(this.GET_FLOW(id)))
  }

  public renameFlow(id: string, newName: string): void {
//    this.sendWebSocketMessage(JSON.stringify(this.FLOW_RENAME(id, newName)))
    function findAndRename(flows, id, newName) {
      flows.forEach(function(result, index) {
        if(result['id'] === id) {
          result['name'] = newName
        } 
      })
    }
    findAndRename(this.flows, id, newName)
    this.saveFlows(this.flows)
  }

  public moveFlowToTrash(id: string): void {
//    this.sendWebSocketMessage(JSON.stringify(this.MOVE_FLOW_TO_TRASH(id)))
    this.deleteFlow(id)
  }

  public deleteFlow(id: string): void {
//    this.sendWebSocketMessage(JSON.stringify(this.DEL_FLOW(id)))
    function findAndRemove(array, id) {
      array.forEach(function(result, index) {
        if(result['id'] === id) {
          array.splice(index, 1)
        }
      })
    }
    findAndRemove(this.flows, id)
    this.saveFlows(this.flows)
  }

  public runFlow(id: string): void {
//    this.sendWebSocketMessage(JSON.stringify(this.RUN_FLOW(id)))
  }

  public commitParagraph(p: any): void {
    this.sendWebSocketMessage(JSON.stringify(this.COMMIT_PARAGRAPH(p)))
  }
        
  public commitParagraphWithGraph(p: any, graph: any): void {
    this.sendWebSocketMessage(JSON.stringify(this.COMMIT_PARAGRAPH_WITH_GRAPH(p, graph)))
  }

  public insertParagraph(index: number): void {
    this.sendWebSocketMessage(JSON.stringify(this.INSERT_PARAGRAPH(index)))
  }

  public moveParagraph(paragraphId: string, index: number): void {
    this.sendWebSocketMessage(JSON.stringify(this.MOVE_PARAGRAPH(paragraphId, index)))
  }

  public removeParagraph(paragraphId: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.PARAGRAPH_REMOVE(paragraphId)))
  }

  public clearParagraphOutput(paragraphId: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.PARAGRAPH_CLEAR_OUTPUT(paragraphId)))
  }

  public getInterpreterBindings(noteId): any {
    this.sendWebSocketMessage(JSON.stringify(this.GET_INTERPRETER_BINDINGS(noteId)))
  }
  
  public saveInterpreterBindings(noteId: string, interpreterIds: [string]) {
    this.sendWebSocketMessage(JSON.stringify(this.SAVE_INTERPRETER_BINDINGS(noteId, interpreterIds)))
  }


// ----------------------------------------------------------------------------

private async wrapOutcome(action: () => Promise<boolean>): Promise<Outcome> {
    var outcome = new Outcome()
    try {
      outcome.success = await action()
    } catch (error) {
      outcome.success = false
    }
    return outcome
  }

  private async wrapResult<TRaw, TOut>(selector: (input: TRaw) => TOut, action: () => Promise<TRaw>): Promise<Result<TOut>> {
    var result: Result<TOut> = new Result<TOut>()
    try {
      var raw = await action()
      var selection = selector(raw)
      result.success = raw !== undefined && selection !== undefined
      result.result = selection
    } catch (error) {
      result.success = false
    }
    return result
  }

// ----------------------------------------------------------------------------

  private sendWebSocketMessage(message: any) {
    var json = JSON.parse(message)
    console.log('Spitfire Send >> %o, %o', json.op, json)
    this.props.dispatchWsMessageSentAction(json)
//    this.webSocketClient.send(message)
    this.sendWaitingForConnection(this, message, undefined)
  }

  private sendWaitingForConnection = function(t, message, callback) {
    this.waitForConnection(t, function() {
      t.webSocketClient.send(message)
      if (typeof callback !== 'undefined') {
        callback()
      }
    }, 1000)
  }

  private waitForConnection = function (t, callback, interval) {
    if (t.webSocketClient.readyState === 1) {
      callback()
    } else {
      var that = t
      // optional: implement backoff for interval here
      setTimeout(function () {
        that.waitForConnection(that, callback, interval)
      }, interval)
    }
  }

// ----------------------------------------------------------------------------

  private PING() {
    return {
      'op':	'PING',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  private NEW_NOTE(name: string) {
    return {
      'op':	'NEW_NOTE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data': {
        'name': name
      }
    }
  }

  private CLONE_NOTE(id: string, name: string) {
    return {
      'op':	'NEW_NOTE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data': {
        'id': id,
        'name': name
      }
    }
  }

  private IMPORT_NOTE(note: any) {
    return {
      'op':	'IMPORT_NOTE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data': {
        'note': note
      }
    }
  }

  private LIST_NOTES() {
    return {
      'op':	'LIST_NOTES',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  private LIST_NOTES_SPITFIRE() {
    return {
      'op':	'LIST_NOTES_SPITFIRE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  private GET_NOTE(id: string) {
    return {
      'op':	'GET_NOTE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'id': id 
      }
    }
  }

  private CHECKPOINT_NOTE(noteId: string, message: string) {
    return {
      "op": "CHECKPOINT_NOTE",
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      "data": {
          "noteId": noteId,
          "commitMessage": message
      }
    }
  }

  private NOTE_RENAME(id: string, newName: string) {
    return {
      'op':	'NOTE_RENAME',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'id': id,
        'name': newName
      }
    }
  }

  private MOVE_NOTE_TO_TRASH(id: string) {
    return {
      'op':	'MOVE_NOTE_TO_TRASH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        'id': id 
      }
    }
  }

  private DEL_NOTE(id: string) {
    return {
      'op':	'DEL_NOTE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'id': id 
      }
    }
  }

  private RUN_PARAGRAPH(paragraph: any, code: string) {
    paragraph.params = {}
    paragraph.paragraph = code
    return {
      'op':	'RUN_PARAGRAPH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	paragraph
    }
  }

  private RUN_ALL_PARAGRAPHS(noteId: string, paragraphs: any[]) {
    return {
      'op':	'RUN_ALL_PARAGRAPHS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        'noteId': noteId,
        'paragraphs': paragraphs
      }
    }
  }

  private RUN_ALL_PARAGRAPHS_SPITFIRE(noteId: string, paragraphs: any[]) {
    return {
      'op':	'RUN_ALL_PARAGRAPHS_SPITFIRE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'noteId': noteId,
        'paragraphs': paragraphs
      }
    }
  }

  private CANCEL_PARAGRAPH(paragraphId) {
    return {
      'op':	'CANCEL_PARAGRAPH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        'id': paragraphId
      }
    }
  }

  private LIST_CONFIGURATIONS() {
    return {
      'op':	'LIST_CONFIGURATIONS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  private LIST_USERS() {
    return {
      'op':	'LIST_USERS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  private ADD_USERS(users: any) {
    return {
      'op':	'ADD_USERS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data': users
    }
  }

  private REMOVE_USERS(users: any) {
    return {
      'op':	'REMOVE_USERS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data': users
    }
  }

  private NEW_FLOW(name: string) {
    return {
      'op':	'NEW_FLOW',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data': {
        'name': name
      }
    }
  }

  private SAVE_FLOWS(flows: any) {
    return {
      'op':	'SAVE_FLOWS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        'flows': flows
      }
    }
  }

  private SAVE_LAYOUT(layout: any) {
    return {
      'op':	'SAVE_LAYOUT',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	layout
    }
  }

  private LIST_FLOWS() {
    return {
      'op':	'LIST_FLOWS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  private GET_FLOW(id: string) {
    return {
      'op':	'GET_NOTE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'id': id 
      }
    }
  }

  private FLOW_RENAME(id: string, newName: string) {
    return {
      'op':	'NOTE_RENAME',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'id': id,
        'name': newName
      }
    }
  }

  private MOVE_FLOW_TO_TRASH(id: string) {
    return {
      'op':	'MOVE_NOTE_TO_TRASH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        'id': id 
      }
    }
  }

  private DEL_FLOW(id: string) {
    return {
      'op':	'DEL_NOTE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'id': id 
      }
    }
  }

  private RUN_FLOW(id: string) {
    return {
      'op':	'RUN_FLOW',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        'flowId': id
      }
    }
  }

  private COMMIT_PARAGRAPH(p: any) {
    // TODO(ECH) This is a hack to overcome Apache Zeppelin bug in NotebookServer#updateParagraph
    // The issue is when Zeppelin does p.setText((String) fromMessage.get("paragraph"))
    // It should be p.setText((String) fromMessage.get("text"))
    p.paragraph = p.text
    return {
      'op':	'COMMIT_PARAGRAPH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	p
    }
  }

  private COMMIT_PARAGRAPH_WITH_GRAPH(p: any, graph: any) {
    return {
      'op':	'COMMIT_PARAGRAPH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'id': p.id, 
        'paragraph': p.text,
        'config': {
            'colWidth': 12,
            'enabled': true,
            'results': {
                '0': {
                    'graph': graph,
                    'helium': {}
                }
            },
            'editorSetting': {
                'language': 'scala'
            },
            'editorMode': 'ace/mode/scala',
            'fontSize': 9
        },
        'params': {}
      }
    }
  }

  private INSERT_PARAGRAPH(index: number) {
    return {
      'op':	'INSERT_PARAGRAPH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        "index": index
      }
    }
  }

  private MOVE_PARAGRAPH(paragraphId: string, index: number) {
    return {
      'op':	'MOVE_PARAGRAPH',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        "id": paragraphId,
        "index": index
      }
    }
  }

  private PARAGRAPH_CLEAR_OUTPUT(paragraphId: string) {
    return {
      'op':	'PARAGRAPH_CLEAR_OUTPUT',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        "id": paragraphId
      }
    }
  }

  private PARAGRAPH_REMOVE(paragraphId: string) { 
    return {
      'op':	'PARAGRAPH_REMOVE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{
        "id": paragraphId
      }
    }
  }

  private GET_INTERPRETER_BINDINGS(noteId: string) { 
    return {
      "op": "GET_INTERPRETER_BINDINGS",
      "data": {
          "noteId": noteId
      },
      "principal": "anonymous",
      "ticket": "anonymous",
      "roles": "[]"
    }
  }

  private SAVE_INTERPRETER_BINDINGS(noteId: string, interpreterIds: [string]) { 
    return {
      "op": "SAVE_INTERPRETER_BINDINGS",
      "data": {
          "noteId": noteId,
          "selectedSettingIds": interpreterIds
      },
      "principal": "anonymous",
      "ticket": "anonymous",
      "roles": "[]"
    }
  }

// ----------------------------------------------------------------------------

  private principalValue(): string {
    if (NotebookStore.state().notebookLogin.result) {
      return NotebookStore.state().notebookLogin.result.body.principal
    }
    return ""
  }

  private rolesValue(): [string] {
    if (NotebookStore.state().notebookLogin.result) {
      return NotebookStore.state().notebookLogin.result.body.roles
    }
    return [""]
  }
  
  private ticketValue(): string {
    if (NotebookStore.state().notebookLogin.result) {
      return NotebookStore.state().notebookLogin.result.body.ticket
    }
    return ""
  }
 
// ----------------------------------------------------------------------------

  private ID = () => Math.random().toString(36).substr(2, 9)

}
