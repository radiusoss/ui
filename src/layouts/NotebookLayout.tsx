import * as React from 'react'
import { connect } from 'react-redux'
import history from './../history/History'
import { Route } from 'react-router-dom'
import AuthenticatedLayout from './../layouts/AuthenticatedLayout'
import Highlights from './../views/about/Highlights'
import Welcome from './../views/Welcome'
import Help from './../views/help/Help'
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
        <Route exact path="/highlights" name="Highlights" component={Highlights} />
        <Route path="/dla" component={AuthenticatedLayout}/>
      </div>
    )
  }

}
