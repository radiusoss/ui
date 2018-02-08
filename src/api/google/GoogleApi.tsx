import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import history from './../../routes/History'
import async from 'async'
import { connect } from 'react-redux'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { NotebookStore } from './../../store/NotebookStore'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { MeStorageKey } from '../notebook/NotebookApi'

export const GoogleProfileStorageKey = 'google_profile'

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class GoogleApi extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private restClient: RestClient
 
  public constructor(props) {
    super(props)
    this.toGoogle = this.toGoogle.bind(this)
    window["GoogleApi"] = this
  }

  public render() {
    const { isToGoogle, isGoogleAuthenticated, googleToken } = this.props
    if (isToGoogle) {
      this.toGoogle()
      return <div></div>
    }
    return <div>{ this.props.children }</div>
  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.restClient = new RestClient({
        name: 'GoogleApi',
        url: this.config.kuberRest,
        path: '/api/v1/google',
        username: '',
        password: ''
      })
    }
  }

  public toGoogle() {
    console.log("Start Login with Google...")
    window.location.href = this.config.kuberRest + "/api/v1/google?"
       + "client_id=" + this.config.googleClientId
       + "&access_type=offline"
       + "&include_granted_scopes=true"
       + "&response_type=code"
       + "&scope=" + this.config.googleScope
  }

  // ----------------------------------------------------------------------------

  public async getMe(): Promise<Result<any>> {
    var profile = JSON.parse(localStorage.getItem(GoogleProfileStorageKey))
    var peopleClient = new RestClient({
      name: 'GooglePersonApi',
      url:  'https://content-people.googleapis.com',
      path: '/v1/people/me',
      username: '',
      password: ''
    })
    var p = {
      access_token: profile.access_token,
      key: this.config.googleApiKey,
      personFields: 'emailAddresses,names,photos,coverPhotos'
    }
    var uri = peopleClient.buildRequestUriWithParams('', p)
    return this.wrapResult<any, any>(
      r => r,
      async () => fetch(uri, {
        method: 'GET',
        headers: new Headers({ 
          "Content-Type": "application/json"
        })
      })
      .then(response => response.json() as any)
    )
  }

  public async getContacts(maxResults): Promise<Result<any>> {
    var profile = JSON.parse(localStorage.getItem(GoogleProfileStorageKey))
    var peopleClient = new RestClient({
      name: 'GooglePersonApi',
      url:  'https://content-people.googleapis.com',
      path: '/v1/people/me',
      username: '',
      password: ''
    })
    var p = {
      access_token: profile.access_token,
      key: this.config.googleApiKey,
      pageSize: maxResults,
      personFields: 'names,emailAddresses,photos,coverPhotos'
    }
    var uri = peopleClient.buildRequestUriWithParams('/connections', p)
    return this.wrapResult<any, any>(
      r => r,
      async () => fetch(uri, {
        method: 'GET',
        headers: new Headers({ 
          "Content-Type": "application/json"
        })
      })
      .then(response => response.json() as any)
    )
  }

  public logout() {
    localStorage.removeItem(GoogleProfileStorageKey)
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
