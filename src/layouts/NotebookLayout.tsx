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
import K8s from './../views/K8s'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class NotebookLayout extends React.Component<any, any> {

  componentDidUpdate(prevProps) {
/*
    const { dispatch, redirectUrl } = this.props
    const isLoggingOut = prevProps.isAadAuthenticated && !this.props.isAadAuthenticated
    const isLoggingIn = !prevProps.isAadAuthenticated && this.props.isAadAuthenticated
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
    isAadAuthenticated: state.isAadAuthenticated,
    redirectURL: state.redirectURL
  }
}
*/
