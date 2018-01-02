import * as React from 'react'
import { Route } from 'react-router-dom'
import history from './History'
import NotebookLayout from './../layouts/NotebookLayout'
import SimpleLayout from './../layouts/SimpleLayout'
import OAuthCallbackAad from './../views/auth/OAuthCallbackAad'
import OAuthCallbackTwitter from './../views/auth/OAuthCallbackTwitter'
import About from './../views/About'
import Page404 from './../views/Page404'
import Page500 from './../views/Page500'

export default class Routes extends React.Component<any, any> {
  
  render() {
    return (
      <div>
          <Route exact path="/" name="Kuber - Collect. Explore. Model. Serve." component={NotebookLayout} />
          <Route exact path="/index.html" name="Kuber - Collect. Explore. Model. Serve." component={NotebookLayout} />
          <Route exact path="/about" name="Simple Layout" component={About} />
          <Route path="/dla" name="Notebook Layout" component={NotebookLayout} />
          <Route path="/simple" name="Simple Layout" component={SimpleLayout} />
          <Route path="*access_token*" name="Microsoft OAuth Callback" component={OAuthCallbackAad}/>
          <Route path="/twitter/auth" name="Twitter OAuth Callback" component={OAuthCallbackTwitter}/>
          <Route path="500" name="Page 500" component={Page500}/>
{/*
          <Route component={AuthenticatedLayout}>
            <Route path="*" name="Page 404" component={Page404}/>
          </Route>
*/}
      </div>
    )
  }

}
