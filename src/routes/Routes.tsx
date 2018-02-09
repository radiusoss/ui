import * as React from 'react'
import { Route } from 'react-router-dom'
import history from './History'
import NotebookLayout from './../layouts/NotebookLayout'
import SimpleLayout from './../layouts/SimpleLayout'
import OAuthGoogleCallback from './../views/auth/OAuthGoogleCallback'
import OAuthMicrosoftCallback from './../views/auth/OAuthMicrosoftCallback'
import OAuthTwitterCallback from './../views/auth/OAuthTwitterCallback'
import About from './../views/about/About'
import Page404 from './../views/error/Page404'
import Page500 from './../views/error/Page500'

export default class Routes extends React.Component<any, any> {
  
  render() {
    return (
      <div>
          <Route exact path="/" name="Datalayer" component={NotebookLayout} />
          <Route exact path="/index.html" name="Datalayer" component={NotebookLayout} />
          <Route path="/auth/google/callback" name="Google OAuth Callback" component={OAuthGoogleCallback}/>
          <Route path="/auth/microsoft/callback" name="Microsoft OAuth Callback" component={OAuthMicrosoftCallback}/>
          <Route path="/auth/twitter/callback" name="Twitter OAuth Callback" component={OAuthTwitterCallback}/>
          <Route path="/dla" name="Notebook Layout" component={NotebookLayout} />
          <Route path="/simple" name="Simple Layout" component={SimpleLayout} />
          <Route path="/500" name="Page 500" component={Page500}/>
{/*
          <Route path="*" name="Page 404" component={Page404}/>
*/}
          </div>
    )
  }

}
