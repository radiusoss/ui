import * as React from 'react'
import Spinner from './../_widget/Spinner'
import history from './../../routes/History'
import { connect } from 'react-redux'
import * as queryString from 'query-string'
import * as isEqual from 'lodash.isequal'
import TwitterApi from './../../api/twitter/TwitterApi'
import NotebookApi from './../../api/notebook/NotebookApi'
import { TwitterProfileStorageKey } from './../../api/twitter/TwitterApi'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from './../../actions/AuthActions'

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class OAuthTwitterCallback extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private twitterApi: TwitterApi
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
        <h1>Checking your Twitter Profile...</h1>
        http://datalayer.io &copy; 2017
      </div>
    </div>
    )
  }

  public componentDidMount() {
    this.twitterApi = window["TwitterApi"]
    this.notebookApi = window["NotebookApi"]
  }

  public componentWillReceiveProps(nextProps) {    
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.checkTwitterProfile()
    }
  }

  private checkTwitterProfile() {
    const callback = queryString.parse(this.props.location.search)
    console.log("Twitter OAuth Callback", callback)
    if (callback) {
      localStorage.setItem(TwitterProfileStorageKey, JSON.stringify(callback))
      this.notebookApi.updateTwitterProfile()
    }
  }

}
