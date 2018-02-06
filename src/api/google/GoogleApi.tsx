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
    this.handleError = this.handleError.bind(this)
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
        path: '/api',
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

  public logout() {
    localStorage.removeItem(GoogleProfileStorageKey)
    localStorage.removeItem(MeStorageKey)
    this.props.dispatchLogoutAction()
  }
/*
  public getMe(callback) {
    var client = this.getClient()
    if (client) {
      client 
      .api('/me')
      .select('displayName,givenName,surname,emailAddresses,userPrincipalName')
      .get((err, res) => {
        if (!err) {
          callback(null, res)
        }
        else this.handleError(err)
      })
    }
  }

  public getMyPicto(callback) {
    var client = this.getClient()
    if (client) {
      client 
      .api('/me/photo/$value')
      .responseType('blob')
			.get((err, res, rawResponse) => {
        if (!err) {
          callback(null, rawResponse.xhr.response)
        }
        else this.handleError(err)
      })
    }
  }

  public getContacts(callback) {
    var client = this.getClient()
    if (client) {
      client 
      .api('/me/contacts')
			.get((err, res) => {
        if (err) {
          this.handleError(err);
        }
        callback(err, (res) ? res.value : [])
      })
    }
  }

  public getPeople(callback) {
    var client = this.getClient()
    if (client) {
      client 
      .api('/me/people')
      .version('beta')
      .filter(`personType eq 'Person'`)
      .select('displayName,givenName,surname,emailAddresses,userPrincipalName')
      .top(20)
      .get((err, res) => {
        if (err) {
          this.handleError(err)
        }
        callback(err, (res) ? res.value : [])
      })
    }
  }

  public getProfilePics(personas, callback) {
    var client = this.getClient()
    if (client) {
      const pic = (p, done) => {
        client 
          .api(`users/${p.props.id}/photo/$value`)
          .header('Cache-Control', 'no-cache')      
          .responseType('blob')
          .get((err, res, rawResponse) => {
            if (err) {
              done(err);
            }
            else {
              p.imageUrl = window.URL.createObjectURL(rawResponse.xhr.response)
              p.initialsColor = null
              done()
            }
          })
      }
      async.each(personas, pic, (err) => {
        callback(err);
      })
    }
  }

  public searchForPeople(searchText, callback) {
    var client = this.getClient()
    if (client) {
      client
        .api('/users')
        .filter(`startswith(displayName,'${searchText}')`)
        .select('displayName,givenName,surname,mail,userPrincipalName,id')
        .top(20)
        .get((err, res) => {
          if (err) {
            this.handleError(err)
          }
          callback(err, (res) ? res.value : [])
        })
    }
  }
*/
  private handleError(err) {
    // Just redirect to the login function when the token is expired.
    // Production should implement more robust token management.
    if (err.statusCode === 401 && err.message === 'Access token has expired.') {
      this.props.dispatchToGoogleAction()
    }
  }
 
}
