import * as React from 'react'
import * as stream from 'stream'
import * as isEqual from 'lodash.isequal'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../config/Config'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'

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
  listNotes(): void
  getNote(id: string): void
  renameNote(id: string, newName: string)
  moveNoteToTrash(id: string): void
  deleteNote(id: string): void
  runNote(id: string, paragraphs: any[])
  cancelParagraph(id: string)
  restartInterpreter(id: string)
  listConfigurations()
  interpreterSetting()
  newFlow(name: string): void
  saveFlow(flow: any): void
  saveFlows(flows: any): void
  listFlows(): void
  getFlow(id: string): void
  renameFlow(id: string, newName: string)
  moveFlowToTrash(id: string): void
  deleteFlow(id: string): void
  runFlow(id: string)
  configuration(): any
}

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SpitfireApi extends React.Component<any, any>  implements ISpitfireApi {
  private config: IConfig = emptyConfig
  private restClient: RestClient
  private webSocketClient: WebSocket
  private flows = []

  state = {
    isAadAuthenticated: false 
  }
  
  public constructor(props) {    
    super(props)
    window['spitfireApi'] = this
  }
  
  public render() {
    return <div>{ this.props.children }</div>
  }

  public componentWillReceiveProps(nextProps) {

    const { isAadAuthenticated, config } = nextProps

    if (! isEqual(config, this.config)) {
      this.config = config
      this.restClient = new RestClient({
        name: 'SpitfireApi',
        url: this.config.spitfireRest,
        path: '/api',
        username: '',
        password: ''
      })
    }

    if (!this.state.isAadAuthenticated && isAadAuthenticated) {

      this.webSocketClient = new WebSocket(this.config.spitfireWs + '/ws')
      this.webSocketClient.onopen = (event: MessageEvent) => {
        console.log("Spitfire WebSocket has been opened.");
        toastr.success('Welcome', 'Connected to Spitfire Server.')
      }
      this.webSocketClient.onmessage = (event: MessageEvent) => {
        let message = JSON.parse(event.data)
        console.log('Spitfire Receive << %o, %o', message.op, message)
        this.props.dispatchWsMessageReceivedAction(message)
      }
      this.webSocketClient.onerror = (event: MessageEvent) => {
        console.log("Spitfire WebSocket Error: " + event.data)
        toastr.warning('Issue while connecting to the server', 'Force reload your browser [' + event.data + ']')
      }
      this.webSocketClient.onclose = (event: CloseEvent) => {
        let code = event.code
        console.log("Spitfire WebSocket Closed: " + code)
        if (code != 1001) {
          toastr.error('Spitfire Connection closed', 'The server is not reachable - Ensure it is online and your network is available, then reload your browser [' + code + ']')
        }
      }
      setInterval( _ => {
        this.ping()
      }, 10000 )

    }

    if (this.state.isAadAuthenticated != isAadAuthenticated) {
      this.setState({
        isAadAuthenticated: isAadAuthenticated
      })
    }

  }

// ----------------------------------------------------------------------------

  public async login(userName, password): Promise<Result<SpitfireResponse>> {
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
      async () => this.restClient.put<SpitfireResponse>({}, jsonOpt, `/interpreter/setting/restart/${id}`)
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

// ----------------------------------------------------------------------------

  public ping(): void {
    this.sendWebSocketMessage(JSON.stringify(this.PING()))
  }
  public newNote(name: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.NEW_NOTE(name)))
  }
  public listNotes(): void {
    this.sendWebSocketMessage(JSON.stringify(this.LIST_NOTES()))
  }
  public getNote(id: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.GET_NOTE(id)))
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
  public runNote(id: string, paragraphs: any[]): void {
    this.sendWebSocketMessage(JSON.stringify(this.RUN_ALL_PARAGRAPHS_SPITFIRE(id, paragraphs)))
  }
  public cancelParagraph(id: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.CANCEL_PARAGRAPH(id)))
  }
  public listConfigurations(): void {
    this.sendWebSocketMessage(JSON.stringify(this.LIST_CONFIGURATIONS()))
  }
  public newFlow(name: string): void {
//    this.sendWebSocketMessage(JSON.stringify(this.NEW_FLOW(name)))
    let flow = {
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

// ----------------------------------------------------------------------------
/*
  private async wrapOutcome(action: () => Promise<boolean>): Promise<Outcome> {
    let outcome = new Outcome()
    try {
      outcome.success = await action()
    } catch (error) {
      outcome.success = false
    }
    return outcome
  }
*/
private async wrapResult<TRaw, TOut>(selector: (input: TRaw) => TOut, action: () => Promise<TRaw>): Promise<Result<TOut>> {
    let result: Result<TOut> = new Result<TOut>()
    try {
      let raw = await action()
      let selection = selector(raw)
      result.success = raw !== undefined && selection !== undefined
      result.result = selection
    } catch (error) {
      result.success = false
    }
    return result
  }

// ----------------------------------------------------------------------------

  private sendWebSocketMessage(message: any) {
    let json = JSON.parse(message)
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
  private LIST_NOTES() {
    return {
      'op':	'LIST_NOTES',
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
      'op':	'RUN_ALL_PARAGRAPHS_SPITFIRE',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'data':	{ 
        'flowId': id
      }
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
