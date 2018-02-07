import * as React from 'react'
import * as stream from 'stream'
import * as isEqual from 'lodash.isequal'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { MeStorageKey } from '../notebook/NotebookApi'

export const TwitterProfileStorageKey = 'twitter_profile'

export interface BooleanResponse {
  boolean: boolean
}
/*
export interface TwitterResponse {
  status?: string
  message?: string
  result?: TwitterBody | string | any
}
export interface TwitterBody {
  principal?: string
  ticket?: string
  roles?: [string]
}
*/
export interface ITwitterApi {
  getMe(): Promise<Result<any>>
  logout(): void
}

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class TwitterApi extends React.Component<any, any>  implements ITwitterApi {
  private config: IConfig = emptyConfig
  private restClient: RestClient

  public constructor(props) {    
    super(props)
    window['TwitterApi'] = this
  }

  public render() {
    const { isToTwitter, isTwitterAuthenticated, twitterToken } = this.props
    if (isToTwitter) {
      this.redirectToTwitterAuth()
      return <div>{ this.props.children }</div>
    }
    return <div>{ this.props.children }</div>
  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.restClient = new RestClient({
        name: 'TwitterApi',
        url: this.config.kuberRest,
        path: '/api/v1/twitter',
        username: '',
        password: ''
      })
    }
  }

  private redirectToTwitterAuth() {
    console.log("Start Login with Twitter...")
    window.location.href = this.config.kuberRest + "/api/v1/twitter"
  }

  // ----------------------------------------------------------------------------

  public async getMe(): Promise<Result<any>> {
    var profile = JSON.parse(localStorage.getItem(TwitterProfileStorageKey))
    return this.wrapResult<any, any>(
      r => r,
      async () => this.restClient.post<any>({
        oauth_access_token: profile.access,
        oauth_verifier: profile.code
      }, null, jsonOpt, "/me")
    )
  }

  public logout() {
    localStorage.removeItem(TwitterProfileStorageKey)
    localStorage.removeItem(MeStorageKey)
    this.props.dispatchLogoutAction()
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

}
