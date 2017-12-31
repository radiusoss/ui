import * as React from 'react'
import * as hello from 'hellojs'
import * as isEqual from 'lodash.isequal'
import history from './../../routes/History'
import { NotebookStore } from './../../store/NotebookStore'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { IConfig, emptyConfig } from './../../config/Config'
import async from 'async'
import { Client } from '@microsoft/microsoft-graph-client'

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class AadApi extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private client: Client

  public constructor(props) {
    super(props)
    this.toAad = this.toAad.bind(this)
    this.handleError = this.handleError.bind(this)
    window["aadApi"] = this
  }

  public render() {
    const { isToAad, isAadAuthenticated, aadToken } = this.props
    if (isToAad) {
      this.toAad()
      return <div></div>
    }
    return <div>{ this.props.children }</div>
  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (! isEqual(config, this.config)) {
      this.config = config
    }
  }

  // Sign the user into Azure AD. HelloJS stores token info in localStorage.hello.
  public toAad() {
    console.log("Initialize Hello for AAD...")
    // Initialize the auth network.
    hello.init({
      aad: {
        name: 'Azure Active Directory',	
        oauth: {
          version: 2,
          auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
        },
        form: false
      }
    })
    // Initialize the auth request.
    hello.init( {
         aad: this.config.azureApplicationId
      },
      {
        redirect_uri: this.config.azureRedirect,
        scope: this.config.azureScope
      })

    console.log("Start Login with Hello for AAD...")
    hello.login('aad', {
      display: 'page',
      state: 'azure-datalayer'
    })

  }

  // Sign the user out of the session.
  public logout() {
    hello('aad').logout()
    localStorage.removeItem("hello")
    localStorage.removeItem("aad")
    localStorage.removeItem("aad_access_token")
    this.props.dispatchLogoutAction()
  }

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

  public getPhoto(callback) {
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

  public sendMail(recipients, subject, content, callback) {
    var client = this.getClient()
    if (client) {
      const email = {
        Subject: subject,
        Body: {
          ContentType: 'HTML',
          Content: content
        },
        ToRecipients: recipients
        }
      client
        .api('/me/sendMail')
        .post({
          'message': email,
          'saveToSentItems': true
        }, (err, res, rawResponse) => {
          if (err) {
            this.handleError(err);
          }
          callback(err, rawResponse.req._data.message.ToRecipients);
        })
    }
  }

  public getFiles(nextLink, callback) {
    var client = this.getClient()
    if (client) {
      let request
      if (nextLink) {
        request = this.client.api(nextLink)
      }
      else {
        request = 
          client
          .api('/me/drive/root/children') 
          .select('name,createdBy,createdDateTime,lastModifiedBy,lastModifiedDateTime,webUrl,file')
          .top(100) // default result set is 200
      }
      request.get((err, res) => {
        if (err) {
          this.handleError(err)
        }
        callback(err, res)
      })
    }
  }
  
  private handleError(err) {
    // Just redirect to the login function when the token is expired.
    // Production should implement more robust token management.
    if (err.statusCode === 401 && err.message === 'Access token has expired.') {
      this.props.dispatchToAadAction()
    }
  }

  private getClient() {
    var auth_token = JSON.parse(localStorage.getItem("aad_access_token"))
    if (auth_token && (this.client == null)) {
      // Initialize the Microsoft Graph Client.
      this.client = Client.init({
        debugLogging: true,
        authProvider: (done) => {
          let access_token = auth_token.access_token
          done(null, access_token)
        }
      })
    }
    return this.client
  }
  
}
