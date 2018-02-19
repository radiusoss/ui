import * as React from 'react'
import history from './../../history/History'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import NotYetAvailable from './../message/NotYetAvailable'
import NotebookApi from './../../api/notebook/NotebookApi'
import ScratchpadDisplay from './../scratchpad/ScratchpadDisplay'
import ClusterHealthWidget from './../cluster/ClusterHealthWidget'
import Calendar from './../calendar/Calendar'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Home extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    note: {
      id: '',
      paragraphs: []
    }
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {

    const { note } = this.state

    return (

      <div className="ms-Grid ms-fadeIn500">

        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <NotYetAvailable/>
          </div>
        </div>

        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3">
            <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/explorer/scratchpad")}}>
              <Icon iconName='NoteForward' className='ms-Icon25' />
              <span className='ms-font-su'> Notebook</span>
            </a>
            { (note.paragraphs.length > 0)  && 
              <ScratchpadDisplay 
                  showGraphBar={false}
                  showControlBar={false}
                  showParagraphTitle={false}
                  note={note} 
                />
            }
          </div>

          <div className="ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3">
            <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/settings")}}>
              <Icon iconName='Health' className='ms-Icon25' />
              <span className='ms-font-su'> Cluster</span>
            </a>
            <ClusterHealthWidget />
          </div>

          <div className="ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3">
            <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/calendar")}}>
              <Icon iconName='Calendar' className='ms-Icon25' />
              <span className='ms-font-su'> Interpreters</span>
            </a>
            <Calendar 
              defaultView='agenda' 
              toolbar={false}
              slots={[
                {
                  id: 0,
                  title: 'A Day Event very long title',
                  allDay: false,
                  start: new Date(2018, 1, 11, 10, 0, 0, 0),
                  end: new Date(2018, 1, 11, 19, 0, 0, 0),
                }
              ]}
            />
          </div>

          <div className="ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3">
            <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/calendar")}}>
              <Icon iconName='Calendar' className='ms-Icon25' />
              <span className='ms-font-su'> Reservations</span>
            </a>
            <Calendar 
              defaultView='agenda' 
              toolbar={false}
              slots={[
                {
                  id: 0,
                  title: 'A Day Event very long title',
                  allDay: false,
                  start: new Date(2018, 1, 11, 10, 0, 0, 0),
                  end: new Date(2018, 1, 11, 19, 0, 0, 0),
                }
              ]}
            />
          </div>

        </div>
      </div>
      

    )

  }

  public componentDidMount() {
    return this.notebookApi.getNote("_conf")
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "NOTE") {
      this.setState({
        note: webSocketMessageReceived.data.note
      })
    }
  }
  
}
