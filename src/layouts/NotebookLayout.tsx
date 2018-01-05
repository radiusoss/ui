import * as React from 'react'
import { connect } from 'react-redux'
import history from './../routes/History'
import { Route } from 'react-router-dom'
import AuthenticatedLayout from './../layouts/AuthenticatedLayout'
import About from './../views/About'
import Check from './../views/Check'
import Welcome from './../views/Welcome'
import Tmp from './../views/Tmp'
import KuberSpl from './../views/KuberSpl'
import Help from './../views/Help'
import K8s from './../views/K8s'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class NotebookLayout extends React.Component<any, any> {

  componentDidUpdate(prevProps) {
/*
    const { dispatch, redirectUrl } = this.props
    const isLoggingOut = prevProps.isMicrosoftAuthenticated && !this.props.isMicrosoftAuthenticated
    const isLoggingIn = !prevProps.isMicrosoftAuthenticated && this.props.isMicrosoftAuthenticated
    if (isLoggingIn) {
      dispatch(history.push(redirectUrl))
    }
    else if (isLoggingOut) {
      // do any kind of cleanup or post-logout redirection here
    }
*/
  }

  render() {

    return (

      <div>
        <Route exact path="/" component={Welcome}/>
        <Route exact path="/index.html" component={Welcome}/>
        <Route exact path="/help" name="Help" component={Help} />
        <Route exact path="/about" name="About" component={About} />
        <Route exact path="/check" name="Check" component={Check} />
        <Route exact path="/k8s" name="Kubernetes" component={K8s} />
        <Route exact path="/kuberspl" name="Kuber Spl" component={KuberSpl} />
        <Route exact path="/tmp" name="Temporary" component={Tmp} />
        <Route path="/dla" component={AuthenticatedLayout}/>
      </div>

    )

}

}
/*
{
function mapStateToPropsAuth(state) {
  return {
    isMicrosoftAuthenticated: state.isMicrosoftAuthenticated,
    redirectURL: state.redirectURL
  }
}
*/
