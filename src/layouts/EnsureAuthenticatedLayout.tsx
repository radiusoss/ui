import * as React from 'react'
import { Route } from 'react-router-dom'
import Auth from './../views/Auth'
import Check from './../views/Check'
import Datasets from './../views/Datasets'
import Flows from './../views/Flows'
import FlowDetail from './../views/flow/FlowDetail'
import FlowDag from './../views/flow/FlowDag'
import Login from './../views/Login'
import NotesList from './../views/notes/NotesList'
import NotesTiles from './../views/notes/NotesTiles'
import Note from './../views/note/Note'
import Profile from './../views/Profile'
import Settings from './../views/Settings'
import Simple from './../views/Simple'
import Lesson1 from '../views/school/lessons/1/Lesson1'
import Lesson2 from '../views/school/lessons/2/Lesson2'
import Lesson3 from '../views/school/lessons/3/Lesson3'
import Stories from './../views/Stories'
import Welcome from './../views/Welcome'
import { connect } from 'react-redux'
import history from './../routes/History'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class EnsureAuthenticatedLayout extends React.Component<any, any> {

  public render() {
    const { isMicrosoftAuthenticated, isTwitterAuthenticated } = this.props
    if (isMicrosoftAuthenticated || isTwitterAuthenticated) {
      return (
        <div>
          <Route exact path="/dla" component={Welcome}/>
          <Route path="/dla/notes/list" name="Notes" component={NotesList}/>
          <Route path="/dla/notes/tiles" name="Notes" component={NotesTiles}/>
          <Route path="/dla/note/:noteId" name="Note Editor" component={Note}/>
          <Route path="/dla/stories" name="Stories" component={Stories}/>
          <Route path="/dla/datasets" name="Datasets" component={Datasets} />
          <Route path="/dla/flows" name="Flows" component={Flows}/>
          <Route path="/dla/flow/dag/:flowId" name="Flow Dag" component={FlowDag}/>
          <Route path="/dla/flow/detail/:flowId" name="Flow Detail" component={FlowDetail}/>
          <Route path="/dla/admin/settings" name="Settings" component={Settings}/>
          <Route path="/dla/profile" name="Profile" component={Profile}/>
          <Route path="/dla/settings" name="Settings" component={Settings}/>
          <Route path="/dla/school/lessons/1" name="Lesson 1" component={Lesson1}/>
          <Route path="/dla/school/lessons/2" name="Lesson 2" component={Lesson2}/>
          <Route path="/dla/school/lessons/3" name="Lesson 3" component={Lesson3}/>
        </div>
      )
    }
    else {
      return <div></div>
    }

  }

  public componentDidMount() {
    const { dispatch, currentURL, isMicrosoftAuthenticated, isTwitterAuthenticated } = this.props
    if (!isMicrosoftAuthenticated && !isTwitterAuthenticated) {
      // Set the current url/path for future redirection (we use a Redux action),
      // then redirect (we use a React Router method).
//      history.push(currentURL)
      history.push("/")    
    }
    else {
      history.push(currentURL)
    }
  }

}
