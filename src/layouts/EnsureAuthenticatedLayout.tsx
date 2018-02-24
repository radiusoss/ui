import * as React from 'react'
import { Route } from 'react-router-dom'
import Check from './../views/spl/Check'
import Datasets from './../views/dataset/Datasets'
import Home from './../views/home/Home'
import Flows from './../views/flows/Flows'
import FlowDetail from './../views/flow/FlowDetail'
import FlowDag from './../views/flow/FlowDag'
import NotesList from './../views/notes/NotesList'
import NotebookCover from './../views/notes/NotesCover'
import NoteWorkbench from './../views/note/NoteWorkbench'
import Scratchpad from './../views/scratchpad/Scratchpad'
import NoteCover from './../views/note/NoteCover'
import Profile from './../views/profile/Profile'
import Users from './../views/users/Users'
import Reservations from './../views/reservations/Reservations'
import History from './../views/history/History'
import Settings from './../views/settings/Settings'
import Status from './../views/status/Status'
import Budget from './../views/budget/Budget'
import Simple from './../views/spl/Simple'
import Lesson1 from '../views/school/lessons/lesson1/Lesson1'
import Lesson2 from '../views/school/lessons/lesson2/Lesson2'
import Lesson3 from '../views/school/lessons/lesson3/Lesson3'
import Stories from './../views/stories/Stories'
import Login from './../views/spl/Login'
import Auth from './../views/spl/Auth'
import Welcome from './../views/Welcome'
import ClusterCapacity from './../views/cluster/ClusterCapacity'
import ClusterUsageStatus from './../views/cluster/ClusterUsageStatus'
import ReservationsStatus from './../views/reservations/ReservationsStatus'
import HDFSStatus from './../views/hdfs/HDFSStatus'
import SparkStatus from './../views/spark/SparkStatus'
import SpitfireInterpretersStatus from './../views/spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../views/network/NetworkStatus'
import RunningStatus from './../views/run/RunningStatus'
import ClusterStatus from './../views/cluster/ClusterStatus'
import AwsStatus from './../views/aws/AwsStatus'
import AppsStatus from './../views/apps/AppsStatus'
import history from './../history/History'
import NotebookApi from './../api/notebook/NotebookApi'
import { NotebookStore } from './../store/NotebookStore'
import * as isEqual from 'lodash.isequal'
import { IConfig, emptyConfig } from './../api/config/ConfigApi'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from './../actions/AuthActions'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from './../actions/ConfigActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class EnsureAuthenticatedLayout extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private notebookApi: NotebookApi

  public constructor(props) {
    super(props)
  }

  public render() {
    const { isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated } = this.props
    if (isGoogleAuthenticated || isMicrosoftAuthenticated || isTwitterAuthenticated) {
      return (
        <div>
          <Route exact path="/dla" component={Welcome}/>
          <Route path="/dla/home" name="Home" component={Home}/>
          <Route path="/dla/kuber/reservations" name="Reservations" component={Reservations}/>
          <Route path="/dla/kuber/profile" name="Profile" component={Profile}/>
          <Route path="/dla/kuber/users" name="Profile" component={Users}/>
          <Route path="/dla/kuber/settings" name="Settings" component={Settings}/>
          <Route exact path="/dla/kuber/status" name="Status" component={Status}/>
          <Route path="/dla/kuber/budget" name="Budget" component={Budget}/>
          <Route path="/dla/kuber/status/cluster" name="Cluster Status" component={ClusterStatus}/>
          <Route path="/dla/kuber/status/aws" name="AWS Status" component={AwsStatus}/>
          <Route path="/dla/kuber/status/apps" name="Applications Status" component={AppsStatus}/>
          <Route path="/dla/kuber/status/cluster-capacity" name="Cluster Capacity" component={ClusterCapacity}/>
          <Route path="/dla/kuber/status/cluster-usage" name="Cluster Usage" component={ClusterUsageStatus}/>
          <Route path="/dla/kuber/status/hdfs" name="HDFS Status" component={HDFSStatus}/>
          <Route path="/dla/kuber/status/reservations" name="Cluster Reservations" component={ReservationsStatus}/>
          <Route path="/dla/kuber/status/spark-repl" name="Spark Status" component={SparkStatus}/>
          <Route path="/dla/kuber/status/interpreters" name="Spitfire Interpreters Status" component={SpitfireInterpretersStatus}/>
          <Route path="/dla/kuber/status/running" name="Running Status" component={RunningStatus}/>
          <Route path="/dla/kuber/status/network" name="Network Status" component={NetworkStatus}/>
          <Route path="/dla/explorer/scratchpad" name="Note Scratchpad" component={Scratchpad}/>
          <Route path="/dla/explorer/note/cover/:noteId" name="Note Cover" component={NoteCover}/>
          <Route path="/dla/explorer/note/workbench/:noteId" name="Note Workbench" component={NoteWorkbench}/>
          <Route path="/dla/explorer/notes/list" name="Notes List" component={NotesList}/>
          <Route path="/dla/explorer/notes/cover" name="Notebook Cover" component={NotebookCover}/>
          <Route path="/dla/explorer/flow/dag/:flowId" name="Flow Dag" component={FlowDag}/>
          <Route path="/dla/explorer/flow/detail/:flowId" name="Flow Detail" component={FlowDetail}/>
          <Route path="/dla/explorer/flows" name="Flows" component={Flows}/>
          <Route path="/dla/explorer/history" name="History" component={History}/>
{/*
          <Route path="/dla/kuber/datasets" name="Datasets" component={Datasets} />
          <Route path="/dla/explorer/stories" name="Stories" component={Stories}/>
*/}
          <Route path="/dla/school/lessons/lesson1" name="Lesson 1" component={Lesson1}/>
          <Route path="/dla/school/lessons/lesson2" name="Lesson 2" component={Lesson2}/>
          <Route path="/dla/school/lessons/lesson3" name="Lesson 3" component={Lesson3}/>
        </div>
      )
    }
    else {
      return <div></div>
    }

  }

  public componentDidMount() {
    this.notebookApi = window["NotebookApi"]
  }

  public componentWillReceiveProps(nextProps) {    
    const { config, goTo, dispatch, location, isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated } = this.props
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      if (!isGoogleAuthenticated && !isMicrosoftAuthenticated && !isTwitterAuthenticated) {
        this.notebookApi.updateGoogleProfile("/")
      }
    }
  }

}
