import * as React from 'react'
import history from './../../routes/History'
import * as queryString from 'query-string'
import * as isEqual from 'lodash.isequal'
import Spinner from './../../_widget/Spinner'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import NotebookApi from './../../api/notebook/NotebookApi'
import GoogleApi from './../../api/google/GoogleApi'
import { GoogleProfileStorageKey } from './../../api/google/GoogleApi'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from './../..//util/rest/RestClient'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from './../../actions/AuthActions'

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class OAuthGoogleCallback extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private googleApi: GoogleApi
  private notebookApi: NotebookApi

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
      <div style={{"textAlign": "center"}}>
        <h1>Checking your Google Profile...</h1>
        http://datalayer.io &copy; 2017-2018
      </div>
    </div>
    )
  }

  public componentDidMount() {
    this.googleApi = window["GoogleApi"]
    this.notebookApi = window["NotebookApi"]
  }

  public componentWillReceiveProps(nextProps) {    
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.checkGoogleProfile()
    }
  }

  private checkGoogleProfile() {
    const callback = queryString.parse(this.props.location.search)
    console.log("Google OAuth Callback", callback)
    if (callback) {
      localStorage.setItem(GoogleProfileStorageKey, JSON.stringify(callback))
      this.notebookApi.updateGoogleProfile()
    }
  }

}
