import * as React from 'react'
import * as hello from 'hellojs'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../actions/ConfigActions'
import * as queryString from 'query-string'
import { RestClient } from '../util/rest/RestClient'
import { ConfigDispatchers } from '../actions/ConfigActions'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'

export type IConfig = {
	azureApplicationId: string
	azureRedirect: string
	azureScope: string
	hdfs: string
	kuberPlane: string
	kuberRest: string
	kuberWs: string
	spitfireRest: string
	spitfireWs: string
	twitterRedirect: string
}

export const emptyConfig: IConfig = {
  azureApplicationId: "",
  azureRedirect: "",
  azureScope: "",
  hdfs: "",
  kuberPlane: "",
  kuberRest: "",
  kuberWs: "",
  spitfireRest: "",
  spitfireWs: "",
  twitterRedirect: ""
}

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Config extends React.Component<any, any> {
  
  public constructor(props) {

    super(props)

    const params = queryString.parse(location.search)
    console.log('URL Params', params)
    
    var kuberRest

    if (params.kuberRest) {
      kuberRest = params.kuberRest
      var kr = { 'kuberRest': kuberRest }
      localStorage.setItem('kuberRest', JSON.stringify(kr))
    } else {
      var krs = localStorage.getItem('kuberRest')    
      if (krs) {
        kuberRest = JSON.parse(krs).kuberRest
      }
      else {
        kuberRest = this.currentBaseUrl()
      }
    }
    console.log('kuberRest', kuberRest)
    
    var restClient = new RestClient({
      name: 'Config',
      url: kuberRest,
      path: '/api/v1',
      username: '',
      password: ''
    })
    
    restClient.get<IConfig>({}, {}, "/config")
    .then(config => { 
      console.log('Config', config)
      var currentBaseUrl = this.currentBaseUrl()
      config.kuberRest = kuberRest
      if (config.azureRedirect == "") {
        config.azureRedirect = currentBaseUrl
      }
      if (config.kuberPlane == "") {
        config.kuberPlane = currentBaseUrl
      }
      if (config.kuberRest == "") {
        config.kuberRest = currentBaseUrl
      }
      if (config.kuberWs == "") {
        config.kuberWs = currentBaseUrl.replace('http', 'ws')
      }
      if (config.twitterRedirect == "") {
        config.twitterRedirect = currentBaseUrl + "/twitter/maketoken"
      }
      console.log('Updated Config', config)
      props.dispatchNewConfigAction(config)
    })
  }

  public render() {
    return <div>{ this.props.children }</div>
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
