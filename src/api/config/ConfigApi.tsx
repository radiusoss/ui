import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapDispatchToPropsNotebook, mapStateToPropsNotebook } from '../../actions/NotebookActions'
import * as queryString from 'query-string'
import { RestClient } from '..//../util/rest/RestClient'
import { ConfigDispatchers } from '..//../actions/ConfigActions'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import NotebookApi from '../../api/notebook/NotebookApi'

export const KuberRestStorageKey = 'kuber_rest'

export type IConfig = {
	hdfs: string
	kuberUi: string
	kuberRest: string
	kuberWs: string
	googleApiKey: string
	googleClientId: string
	googleRedirect: string
	googleScope: string
	microsoftApplicationId: string
	microsoftRedirect: string
	microsoftScope: string
	spitfireRest: string
	spitfireWs: string
	twitterRedirect: string
}

export const emptyConfig: IConfig = {
  hdfs: '',
  kuberUi: '',
  kuberRest: '',
  kuberWs: '',
	googleApiKey: '',
	googleClientId: '',
	googleRedirect: '',
	googleScope: '',
  microsoftApplicationId: '',
  microsoftRedirect: '',
  microsoftScope: '',
  spitfireRest: '',
  spitfireWs: '',
  twitterRedirect: ''
}

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ConfigApi extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    kuberRest: '',
    config: emptyConfig
  }
  
  public constructor(props) {
    super(props)
    window['ConfigApi'] = this
  }

  public render() {
    return <div>{ this.props.children }</div>
  }

  public componentDidMount() {

    this.notebookApi = window['NotebookApi'] 

    // TODO(ECH)
    // + Move this config class to the config view to use parse(this.props.location.search).
    // + Moreover, all the config stuff should be locate at the same place...
    const params = queryString.parse(location.search)
    console.log('URL Params', params)
    
    var kuberRest

    if (params.kuberRest) {
      kuberRest = params.kuberRest
      var kr = { 'kuberRest': kuberRest }
      localStorage.setItem(KuberRestStorageKey, JSON.stringify(kr))
    } else {
      var krs = localStorage.getItem(KuberRestStorageKey)    
      if (krs) {
        kuberRest = JSON.parse(krs).kuberRest
      }
      else {
        kuberRest = this.currentBaseUrl()
      }
    }
    console.log(KuberRestStorageKey, kuberRest)
    
    var restClient = new RestClient({
      name: 'Config',
      url: kuberRest,
      path: '/kuber/api/v1',
      username: '',
      password: ''
    })
    
    restClient.get<IConfig>({}, {}, "/config")
    .then(config => { 
      console.log('Config', config)
      var currentBaseUrl = this.currentBaseUrl()
      config.kuberRest = kuberRest
      if (config.kuberUi == '') {
        config.kuberUi = currentBaseUrl
      }
      if (config.kuberRest == '') {
        config.kuberRest = currentBaseUrl
      }
      if (config.kuberWs == '') {
        config.kuberWs = currentBaseUrl.replace('http', 'ws')
      }
      if (config.googleRedirect == '') {
        config.googleRedirect =  config.kuberUi + "/kuber/auth/google/redirect"
      }
      if (config.microsoftRedirect == '') {
        config.microsoftRedirect = config.kuberUi + "/kuber/auth/microsoft/redirect"
      }
      if (config.twitterRedirect == '') {
        config.twitterRedirect = config.kuberUi + "/kuber/api/v1/twitter/maketoken"
      }
      console.log('Updated Config', config)
      this.setState({
        kuberRest: kuberRest,
        config: config
      })
      this.props.dispatchNewConfigAction(config)
//      this.props.dispatchGoToAction()
    })

  }

  public getConfig() {
    return this.state.config
  }

  @autobind
  private currentBaseUrl() {
    return window.location.protocol 
    + '//'
    + window.location.hostname
    + ( window.location.port  == '' 
      ? '' 
      : ':' + window.location.port  )
  }

}
