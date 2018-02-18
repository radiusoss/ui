import * as React from 'react'
import history from './../../history/History'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import NotYetAvailable from './../message/NotYetAvailable'
import NotebookApi from './../../api/notebook/NotebookApi'
import ScratchpadDisplay from './../scratchpad/ScratchpadDisplay'
import ClusterHealth from './../cluster/ClusterHealth'
import Calendar from './../calendar/Calendar'
import { Slider } from 'office-ui-fabric-react/lib/Slider'
import { toastr } from 'react-redux-toastr'

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

          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/explorer/scratchpad")}}>
              <Icon iconName='NoteForward' className='ms-Icon50' />
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

          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/settings")}}>
              <Icon iconName='Health' className='ms-Icon50' />
            </a>
            <ClusterHealth/>
            <Slider
                label='Number of Workers'
                min={ 0 }
                max={ 3 }
                step={ 1 }
                defaultValue={ 2 }
                showValue={ true }
                disabled={ true }
                onChange={ (value) => toastr.warning('Not yet available', 'Wait the new version to get ' + value + ' worker(s).') }
              />
          </div>

          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/calendar")}}>
              <Icon iconName='Calendar' className='ms-Icon50' />
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
