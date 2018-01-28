import * as React from 'react'
import { Route } from 'react-router-dom'
import Header from '../blocks/Header'
import Sidebar from '../blocks/Sidebar'
import Aside from '../blocks/Aside'
import Footer from '../blocks/Footer'
import Breadcrumbs from 'react-breadcrumbs'
import EnsureAuthenticatedLayout from './../layouts/EnsureAuthenticatedLayout'
import K8S from './../views/spl/Spl'
import Check from './../views/spl/Check'
import About from './../views/about/About'
import Help from './../views/help/Help'
import KuberSpl from './../views/spl/KuberSpl'

export default class AuthenticatedLayout extends React.Component<any, any> {

  public render() {
    
    return (
      <div className="app" style={{ overflowY: 'hidden' }}>

        <Header />

        <div className="app-body">

        <Route path="/" component={Sidebar} />

        <main className="main">
{/*
            <Breadcrumbs
              wrapperElement="ol"
              wrapperClass="breadcrumb"
              itemClass="breadcrumb-item"
              separator=""
              routes={this.props.routes}
              params={this.props.params}
              displayMissing={false}
            />
*/}
            <div className="container-fluid" style={{ padding: this.getPadding(), overflowY: 'hidden' }}>
              <Route exact path="/dla/about" name="About" component={About} />
              <Route exact path="/dla/help" name="Help" component={Help} />
              <Route exact path="/dla/check" name="Check" component={Check} />
              <Route exact path="/dla/k8s" name="Kubernetes" component={K8S} />
              <Route exact path="/dla/kuberspl" name="Kuber Spl" component={KuberSpl} />
              <Route path="/dla" component={EnsureAuthenticatedLayout} />
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    )
  }

  private getPadding() {
    if (
      this.props.location.pathname.indexOf("/dla/notes") > -1 || 
      this.props.location.pathname.indexOf("/dla/note/") > -1 ||
      this.props.location.pathname.indexOf("/dla/flows") > -1 ||
      this.props.location.pathname.indexOf("/dla/flow/dag") > -1 
      ) {
      return '0px'
    }
    else {
      return '30px'
    }
  }

  private getOverflowY() {
    return this.props.location.pathname.indexOf("/dla/note/") > -1 ? 'hidden' : 'auto'
  }

}
