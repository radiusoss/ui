import * as React from 'react'
import * as stream from 'stream'
import * as isEqual from 'lodash.isequal'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../config/Config'
import { RestClient, Result, Outcome, ClientOptions } from '../../util/rest/RestClient'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'

export interface BooleanResponse {
  boolean: boolean
}
export interface TwitterResponse {
  status?: string
  message?: string
  body?: TwitterBody | string | any
}
export interface TwitterBody {
  principal?: string
  ticket?: string
  roles?: [string]
}
export interface ITwitterApi {
//  login(userName, password): Promise<Result<TwitterResponse>>
}

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class TwitterApi extends React.Component<any, any>  implements ITwitterApi {
  private config: IConfig = emptyConfig
  private readonly jsonOpt = { json: true }

  public constructor(props) {    
    super(props)
    window['twitterApi'] = this
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
    if (! isEqual(config, this.config)) {
      this.config = config
    }
  }

  private redirectToTwitterAuth() {
    window.location.href = this.config.kuberRest + "/twitter/request"
  }

  private logoutFromTwitter() {
    localStorage.removeItem("twitter")
    this.props.dispatchLogoutAction()
  }

}
