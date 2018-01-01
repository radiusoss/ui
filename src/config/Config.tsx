import * as React from 'react'
import * as hello from 'hellojs'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../actions/ConfigActions'
import * as queryString from 'query-string'
import { RestClient } from '../util/rest/RestClient'
import { ConfigDispatchers } from '../actions/ConfigActions'

export type IConfig = {
	kuberRest: string
	kuberWs: string
	azureApplicationId: string
	azureRedirect: string
	azureScope: string
	spitfireRest: string
	spitfireWs: string
	hdfs: string
}

export const emptyConfig: IConfig = {
  kuberRest: "",
  kuberWs: "",
  azureApplicationId: "",
  azureRedirect: "",
  azureScope: "",
  spitfireRest: "",
  spitfireWs: "",
  hdfs: ""
}

@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Config extends React.Component<any, any> {
  
  public constructor(props) {

    super(props)

    const params = queryString.parse(location.search)
    console.log('URL Params', params)
    
    // --- kuber_rest
    
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
        kuberRest = window.location.protocol 
          + '//'
          + window.location.hostname
          + ( window.location.port  == '' 
            ? '' 
            : ':' + window.location.port  )
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
      .then(function(config) {
        console.log('Config', config)
        config.kuberRest = kuberRest
        props.dispatchNewConfigAction(config)
      })
    
  }

  public render() {
    return <div>{ this.props.children }</div>
  }

}
