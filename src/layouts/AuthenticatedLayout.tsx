import * as React from 'react'
import { Route } from 'react-router-dom'
import Header from '../blocks/Header'
import Sidebar from '../blocks/Sidebar'
import Aside from '../blocks/Aside'
import Footer from '../blocks/Footer'
import Breadcrumbs from 'react-breadcrumbs'
import EnsureAuthenticatedLayout from './../layouts/EnsureAuthenticatedLayout'
import Highlights from './../views/about/Highlights'
import HallOfFame from './../views/about/HallOfFame'
import Docs from './../views/docs/Docs'
import Platform from './../views/about/Platform'
import ReleaseNotes from './../views/about/ReleaseNotes'
import Help from './../views/help/Help'

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
              <Route exact path="/dla/about/platform" name="Datalayer" component={Platform} />
              <Route exact path="/dla/about/highlights" name="Highlights" component={Highlights} />
              <Route exact path="/dla/about/release-notes" name="Release Notes" component={ReleaseNotes} />
              <Route exact path="/dla/about/hall-of-fame" name="About" component={HallOfFame} />
              <Route exact path="/dla/support/docs" name="Docs" component={Docs} />
              <Route exact path="/dla/support/help" name="Help" component={Help} />
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
      this.props.location.pathname.indexOf("/dla/explorer/notes") > -1 || 
      this.props.location.pathname.indexOf("/dla/explorer/note/") > -1 ||
      this.props.location.pathname.indexOf("/dla/explorer/scratchpad") > -1 ||
      this.props.location.pathname.indexOf("/dla/support/docs") > -1 ||
      this.props.location.pathname.indexOf("/dla/explorer/flows") > -1 ||
      this.props.location.pathname.indexOf("/dla/explorer/flow/dag") > -1 
      ) {
      return '0px'
    }
    else {
      return '30px'
    }
  }

  private getOverflowY() {
    return this.props.location.pathname.indexOf("/dla/explorer/note/") > -1 ? 'hidden' : 'auto'
  }

}
