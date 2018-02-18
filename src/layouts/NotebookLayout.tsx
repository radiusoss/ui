import * as React from 'react'
import { connect } from 'react-redux'
import history from './../history/History'
import { Route } from 'react-router-dom'
import AuthenticatedLayout from './../layouts/AuthenticatedLayout'
import About from './../views/about/About'
import Check from './../views/spl/Check'
import Welcome from './../views/Welcome'
import Tmp from './../views/spl/Tmp'
import KuberSpl from './../views/spl/KuberSpl'
import Help from './../views/help/Help'
import Kuber from './../views/spl/Spl'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from './../actions/AuthActions'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from './../actions/ConfigActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class NotebookLayout extends React.Component<any, any> {

  public constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <Route exact path="/" component={Welcome}/>
        <Route exact path="/index.html" component={Welcome}/>
        <Route exact path="/help" name="Help" component={Help} />
        <Route exact path="/about" name="About" component={About} />
        <Route exact path="/check" name="Check" component={Check} />
        <Route exact path="/k8s" name="Kubernetes" component={Kuber} />
        <Route exact path="/kuber/spl" name="Kuber Spl" component={KuberSpl} />
        <Route exact path="/tmp" name="Temp" component={Tmp} />
        <Route path="/dla" component={AuthenticatedLayout}/>
      </div>
    )
  }

}
