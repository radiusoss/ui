import * as React from 'react'
import { Route } from 'react-router-dom'
import Check from './../views/spl/Check'
import Datasets from './../views/dataset/Datasets'
import Board from './../views/board/Board'
import Flows from './../views/flows/Flows'
import FlowDetail from './../views/flow/FlowDetail'
import FlowDag from './../views/flow/FlowDag'
import NotesList from './../views/notes/NotesList'
import NotesTiles from './../views/notes/NotesTiles'
import NoteLinesLayout from './../views/note/NoteLinesLayout'
import Scratchpad from './../views/scratchpad/Scratchpad'
import NoteResultsLayout from './../views/note/NoteResultsLayout'
import Profile from './../views/profile/Profile'
import Users from './../views/users/Users'
import Calendar from './../views/calendar/Calendar'
import Settings from './../views/settings/Settings'
import Simple from './../views/spl/Simple'
import Lesson1 from '../views/school/lessons/1/Lesson1'
import Lesson2 from '../views/school/lessons/2/Lesson2'
import Lesson3 from '../views/school/lessons/3/Lesson3'
import Stories from './../views/stories/Stories'
import Login from './../views/spl/Login'
import Auth from './../views/spl/Auth'
import Welcome from './../views/Welcome'
import { connect } from 'react-redux'
import history from './../routes/History'
import { NotebookStore } from './../store/NotebookStore'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class EnsureAuthenticatedLayout extends React.Component<any, any> {

  public render() {
    const { isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated } = this.props
    if (isGoogleAuthenticated || isMicrosoftAuthenticated || isTwitterAuthenticated) {
      return (
        <div>
          <Route exact path="/dla" component={Welcome}/>
          <Route path="/dla/board" name="Board" component={Board}/>
          <Route path="/dla/notes/list" name="Notes" component={NotesList}/>
          <Route path="/dla/notes/tiles" name="Notes" component={NotesTiles}/>
          <Route path="/dla/note/lines/:noteId" name="Note Lines Layout" component={NoteLinesLayout}/>
          <Route path="/dla/note/scratchpad" name="Note Scratchpad" component={Scratchpad}/>
          <Route path="/dla/note/results/:noteId" name="Note Results Layout" component={NoteResultsLayout}/>
          <Route path="/dla/stories" name="Stories" component={Stories}/>
          <Route path="/dla/datasets" name="Datasets" component={Datasets} />
          <Route path="/dla/flows" name="Flows" component={Flows}/>
          <Route path="/dla/flow/dag/:flowId" name="Flow Dag" component={FlowDag}/>
          <Route path="/dla/flow/detail/:flowId" name="Flow Detail" component={FlowDetail}/>
          <Route path="/dla/profile" name="Profile" component={Profile}/>
          <Route path="/dla/users" name="Profile" component={Users}/>
          <Route path="/dla/calendar" name="Profile" component={Calendar}/>
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
    const { dispatch, currentURL, isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated } = this.props
    if (!isGoogleAuthenticated && !isMicrosoftAuthenticated && !isTwitterAuthenticated) {
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
