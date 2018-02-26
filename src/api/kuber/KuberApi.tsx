import * as React from 'react'
import * as stream from 'stream'
import * as isEqual from 'lodash.isequal'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import ReconnectingWebSocket from './../../util/websocket/ReconnectingWebSocket'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { NotebookStore } from './../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import * as moment from 'moment'

export interface BooleanResponse {
  boolean: boolean
}

export interface KuberResponse {
  status?: string
  message?: string
  body?: KuberBody | string | any
}

export interface KuberBody {
  principal?: string
  ticket?: string
  roles?: [string]
}

export interface IKuberApi {
  login(userName, password): Promise<Result<KuberResponse>>
  ticket(): Promise<Result<KuberResponse>>
  version(): Promise<Result<KuberResponse>>
  send(body: string): void
  ping(): void
  command(name: string): void
}

export var loading = {
  success: false,
  result: {
    message: '...loading...'
  }
}

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
export default class KuberApi extends React.Component<any, any>  implements IKuberApi {
  private config: IConfig = emptyConfig
  private restClient: RestClient
  private webSocketClient: ReconnectingWebSocket
  
  state = {
    isGoogleAuthenticated: false,
    isMicrosoftAuthenticated: false,
    isTwitterAuthenticated: false,
    webSocketHealthy: false
  }

  public constructor(props) {
    super(props)
    window['KuberApi'] = this
  }
  
  public render() {
    return <div>{ this.props.children }</div>
  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.webSocketClient = new ReconnectingWebSocket(this.config.kuberWs + '/kuber/api/v1/ws')
      this.webSocketClient.onopen = (event: MessageEvent) => {
        console.log("Kuber WebSocket has been opened.")
        toastr.success('Kuber', 'Connected to Kuber Server.')
        this.setState({
          webSocketHealthy: true
        })
      }
      this.webSocketClient.onmessage = (event: MessageEvent) => {
        var message = JSON.parse(event.data)
        console.log('Kuber Receive << %o, %o', message.op, message)
        this.props.dispatchKuberMessageReceivedAction(message)
        this.setState({
          webSocketHealthy: true
        })
      }
      this.webSocketClient.onerror = (event: MessageEvent) => {
        console.log("Kuber WebSocket Error: " + event.data)
        toastr.error('Issue while connecting to Kuber', 'Check your network and/or force reload your browser.')
        this.setState({
          webSocketHealthy: false
        })
      }
      this.webSocketClient.onclose = (event: CloseEvent) => {
        var code = event.code
        console.log("Kuber WebSocket closed: " + code)
        this.setState({
          webSocketHealthy: false
        })
        if (code != 1001) {
          toastr.warning('Kuber Connection closed', 'Kuber Server is not reachable - Ensure it is online and your network is available, then reload your browser [' + code + ']')
        }
      }
      setInterval( _ => {
        this.ping()
      }, 10000 )
      setInterval( _ => {
        this.status()
      }, 50000 )
      this.restClient = new RestClient({
        name: 'KuberApi',
        url: this.config.kuberRest,
        path: '/kuber/api',
        username: '',
        password: ''
      })
    }
  }

// ----------------------------------------------------------------------------

  public async login(userName, password): Promise<Result<KuberResponse>> {
    return this.wrapResult<KuberResponse, KuberResponse>(
      r => r,
      async () => this.restClient.postForm<KuberResponse>({ userName: userName, password: password }, {}, jsonOpt, "/login")
    )
  }

  public async ticket(): Promise<Result<KuberResponse>> {
    return this.wrapResult<KuberResponse, KuberResponse>(
      r => r,
      async () => this.restClient.get<KuberResponse>({}, jsonOpt, '/security/ticket')
    )
  }
  
  public async version(): Promise<Result<KuberResponse>> {
    return this.wrapResult<KuberResponse, KuberResponse>(
      r => r,
      async () => this.restClient.get<KuberResponse>({}, jsonOpt, '/version')
    )
  }

  public async getClusterDef(): Promise<Result<KuberResponse>> {
    return this.wrapResult<KuberResponse, KuberResponse>(
      r => r,
      async () => this.restClient.get<KuberResponse>({}, jsonOpt, '/v1/cluster?filterBy=&itemsPerPage=10&name=&namespace=&page=1&sortBy=d,creationTimestamp')
    )
  }

  public async getOverview(): Promise<Result<KuberResponse>> {
    return this.wrapResult<KuberResponse, KuberResponse>(
      r => r,
      async () => this.restClient.get<KuberResponse>({}, jsonOpt, '/v1/overview?filterBy=&itemsPerPage=10&name=&page=1&sortBy=d,creationTimestamp')
    )
  }

  public async getApps(): Promise<Result<KuberResponse>> {
    return this.wrapResult<KuberResponse, KuberResponse>(
      r => r,
      async () => this.restClient.get<KuberResponse>({}, jsonOpt, '/v1/helm')
    )
  }

// ----------------------------------------------------------------------------

  public send(body: string): void {
    this.sendWebSocketMessage(JSON.stringify(body))
  }

  public ping(): void {
    this.sendWebSocketMessage(JSON.stringify(this.KUBER_PING()))
  }

  public status(): void {
    this.sendWebSocketMessage(JSON.stringify(this.KUBER_STATUS()))
  }

  public putSlots(slots): void {
    this.sendWebSocketMessage(JSON.stringify(this.PUT_SLOTS(slots)))
  }

  public getSlots(): void {
    this.sendWebSocketMessage(JSON.stringify(this.GET_SLOTS()))
  }

  public command(command: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.COMMAND(command)))
  }

// ----------------------------------------------------------------------------

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
    console.log('Kuber Send >> %o, %o', json.op, json)
    this.props.dispatchKuberMessageSentAction(json)
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

public KUBER_PING() {
  return {
    'op':	'KUBER_PING',
    'principal': this.principalValue(),
    'ticket':	this.ticketValue(),
    'roles': this.rolesValue()
  }
  }

  public KUBER_STATUS() {
    return {
      'op':	'KUBER_STATUS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  public PUT_SLOTS(slots) {
    var slt = slots.map(s => {
      return {
      id: s.id,
      title: s.title,
      start: moment(s.start).toISOString(),
      end: moment(s.end).toISOString(),
      desc: s.desc,
      allDay: s.allDay
      }
    })    
    return {
      'op':	'PUT_SLOTS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'slots': slt
    }
  }

  public GET_SLOTS() {
    return {
      'op':	'GET_SLOTS',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  public COMMAND(command: string) {
    return {
      'op':	'COMMAND',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue(),
      'message': command,
      'data': {
        'name': name
      }
    }
  }

  public CREATE_CLUSTER_DEF() {
    return {
      'op':	'CREATE_CLUSTER_DEF',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  public CREATE_CLUSTER() {
    return {
      'op':	'CREATE_CLUSTER',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
    }
  }

  public DELETE_CLUSTER() {
    return {
      'op':	'DELETE_CLUSTER',
      'principal': this.principalValue(),
      'ticket':	this.ticketValue(),
      'roles': this.rolesValue()
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
