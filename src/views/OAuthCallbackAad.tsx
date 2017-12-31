import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import Spinner from './_widget/Spinner'
import history from './../routes/History'
import { connect } from 'react-redux'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'
import { NotebookStore } from './../store/NotebookStore'
import NotebookApi from './../api/notebook/NotebookApi'
import AadApi from '../api/microsoft/AadApi'
import { mapStateToPropsConfig, mapDispatchToPropsConfig } from '../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'
import { IConfig, emptyConfig } from './../config/Config'
import * as queryString from 'query-string'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class OAuthCallbackAad extends React.Component<AuthDispatchers & AuthProps, any> {
  private config: IConfig = emptyConfig
  private notebookApi: NotebookApi
  private aadApi: AadApi

  public constructor(props) {
    super(props)
  }

  public render() {
    return (

      <div id="preloader">
      <div className="sk-cube-grid">
        <div className="sk-cube sk-cube1"></div>
        <div className="sk-cube sk-cube2"></div>
        <div className="sk-cube sk-cube3"></div>
        <div className="sk-cube sk-cube4"></div>
        <div className="sk-cube sk-cube5"></div>
        <div className="sk-cube sk-cube6"></div>
        <div className="sk-cube sk-cube7"></div>
        <div className="sk-cube sk-cube8"></div>
        <div className="sk-cube sk-cube9"></div>
      </div>
      <div style={{"text-align": "center"}}>
        <h1>Checking your Credentials...</h1>
        http://datalayer.io &copy; 2017
      </div>
    </div>
/*      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-2">Hold on.</h1>
              <h4 className="pt-1">We are checking your profile...</h4>
            </div>
            <Spinner size={100} />
          </div>
        </div>
      </div>
*/
    )
  }

  public componentDidMount() {
    this.notebookApi = window["notebookApi"]
    this.aadApi = window["aadApi"]
    this.checkAadProfile()
  }

  public componentWillReceiveProps(nextProps) {    
    const { config } = nextProps
    if (! isEqual(config, this.config)) {
      this.config = config
    }
  }

  private checkAadProfile() {
    const parsedAuth = queryString.parse(location.hash.replace("/access_token", "access_token"))
    console.log("OAuth Callback Aad", parsedAuth)
    localStorage.setItem("aad_access_token", JSON.stringify(parsedAuth))
  }

  private updateProfile() {
    var parsedAuth = localStorage.getItem("aad_access_token")
    if (parsedAuth) {
      this.aadApi.getMe(async (err, me) => {
        if (!err) {
          let principalName = me.userPrincipalName
          console.log("Aad principalName", principalName)
          this.notebookApi.login(principalName, principalName)
            .then(res =>  {
              console.log('Notebook Login', res)
              NotebookStore.state().notebookLogin = res}
            )
          this.aadApi.getPhoto((err, photoBlob) => {
            if (!err) {
              NotebookStore.state().profilePhotoBlob = photoBlob
              console.log("Aad photoBlob", photoBlob)
              history.push("/")
            }
          })
        }
      })
    }
  }

}
