import * as React from 'react'
import * as stream from 'stream'
import * as isEqual from 'lodash.isequal'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsK8S, mapDispatchToPropsK8S } from '../../actions/K8SActions'
import { NotebookStore } from './../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'

export interface BooleanResponse {
  boolean: boolean
}

export interface K8SResponse {
  status?: string
  message?: string
  body?: K8SBody | string | any
}

export interface K8SBody {
  principal?: string
  ticket?: string
  roles?: [string]
}

export interface IK8SApi {
  login(userName, password): Promise<Result<K8SResponse>>
  ticket(): Promise<Result<K8SResponse>>
  version(): Promise<Result<K8SResponse>>
  send(body: string): void
  ping(): void
  command(name: string): void
}

export var loading = {
  success: false,
  result: {
    message: 'loading...'
  }
}

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsK8S, mapDispatchToPropsK8S)
export default class K8SApi extends React.Component<any, any>  implements IK8SApi {
  private config: IConfig = emptyConfig
  private restClient: RestClient
  private webSocketClient: WebSocket
  
  public constructor(props) {    
    super(props)
    window['K8SApi'] = this
  }
  
  public render() {
    return <div>{ this.props.children }</div>
  }

  public componentWillReceiveProps(nextProps) {

    const { config } = nextProps

    if (config && ! isEqual(config, this.config)) {

      this.config = config

      this.webSocketClient = new WebSocket(this.config.kuberWs + '/api/v1/ws')
      this.webSocketClient.onopen = (event: MessageEvent) => {
        console.log("K8S WebSocket has been opened.");
        toastr.success('Kuber', 'Connected to Kuber Server.')
      }
      this.webSocketClient.onmessage = (event: MessageEvent) => {
        let message = JSON.parse(event.data)
        console.log('K8S Receive << %o, %o', message.op, message)
        this.props.dispatchK8SMessageReceivedAction(message)
      }
      this.webSocketClient.onerror = (event: MessageEvent) => {
        console.log("K8S WebSocket Error: " + event.data)
        toastr.warning('Issue while connecting to the server', 'Force reload your browser [' + event.data + ']')
      }
      this.webSocketClient.onclose = (event: CloseEvent) => {
        let code = event.code
        console.log("K8S WebSocket Closed: " + code)
        if (code != 1001) {
          toastr.light('K8S Interaction Finished', 'Check the result on the K8S page.')
        }
      }
      setInterval( _ => {
        this.ping()
      }, 10000 )

      this.restClient = new RestClient({
        name: 'K8SApi',
        url: this.config.kuberRest,
        path: '/api',
        username: '',
        password: ''
      })

    }

  }

// ----------------------------------------------------------------------------

  public async login(userName, password): Promise<Result<K8SResponse>> {
    return this.wrapResult<K8SResponse, K8SResponse>(
      r => r,
      async () => this.restClient.postForm<K8SResponse>({ userName: userName, password: password }, {}, jsonOpt, "/login")
    )
  }

  public async ticket(): Promise<Result<K8SResponse>> {
    return this.wrapResult<K8SResponse, K8SResponse>(
      r => r,
      async () => this.restClient.get<K8SResponse>({}, jsonOpt, '/security/ticket')
    )
  }
  
  public async version(): Promise<Result<K8SResponse>> {
    return this.wrapResult<K8SResponse, K8SResponse>(
      r => r,
      async () => this.restClient.get<K8SResponse>({}, jsonOpt, '/version')
    )
  }

  public async getClusterDef(): Promise<Result<K8SResponse>> {
    return this.wrapResult<K8SResponse, K8SResponse>(
      r => r,
      async () => this.restClient.get<K8SResponse>({}, jsonOpt, '/v1/cluster?filterBy=&itemsPerPage=10&name=&namespace=&page=1&sortBy=d,creationTimestamp')
    )
  }

  public async getOverview(): Promise<Result<K8SResponse>> {
    return this.wrapResult<K8SResponse, K8SResponse>(
      r => r,
      async () => this.restClient.get<K8SResponse>({}, jsonOpt, '/v1/overview?filterBy=&itemsPerPage=10&name=&page=1&sortBy=d,creationTimestamp')
    )
  }

  public async getApps(): Promise<Result<K8SResponse>> {
    return this.wrapResult<K8SResponse, K8SResponse>(
      r => r,
      async () => this.restClient.get<K8SResponse>({}, jsonOpt, '/v1/helm')
    )
  }

// ----------------------------------------------------------------------------

  public send(body: string): void {
    this.sendWebSocketMessage(JSON.stringify(body))
  }

  public ping(): void {
    this.sendWebSocketMessage(JSON.stringify(this.PING()))
  }

  public command(command: string): void {
    this.sendWebSocketMessage(JSON.stringify(this.COMMAND(command)))
  }

// ----------------------------------------------------------------------------

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
    console.log('K8S Send >> %o, %o', json.op, json)
    this.props.dispatchK8SMessageSentAction(json)
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

  public PING() {
    return {
      'op':	'PING',
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
