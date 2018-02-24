import * as React from 'react'
import history from './../../history/History'
import { toastr } from 'react-redux-toastr'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import NotebookApi from './../../api/notebook/NotebookApi'
import ScratchpadDisplay from './../scratchpad/ScratchpadDisplay'
import ClusterHealthWidget from './../cluster/ClusterHealthWidget'
import ReservationsStatus from './../reservations/ReservationsStatus'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

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

      <div className={`ms-Grid ms-fadeIn500`}>

        <div className="ms-Grid-row">

          <div className={`${styles.homeHeight} ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3`}>
            <Icon iconName='ReadingMode' className='ms-Icon25' />
            <span className='ms-font-xxl'> <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/explorer/notes/list")}}>Notebook</a></span>
{/*
            { (note.paragraphs.length > 0)  && 
              <ScratchpadDisplay 
                  showGraphBar={false}
                  showControlBar={false}
                  showParagraphTitle={false}
                  note={note} 
                />
            }
*/}
          </div>

          <div className={`${styles.homeHeight} ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3`}>
            <Icon iconName='Health' className='ms-Icon25' />
            <span className='ms-font-xxl'> <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/status")}}>Cluster</a></span>
            <ClusterHealthWidget />
          </div>

          <div className={`${styles.homeHeight} ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3`}>
            <Icon iconName='Light' className='ms-Icon25' />
            <span className='ms-font-xxl'> <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/status/interpreters")}}>Interpreters</a></span>
            <SpitfireInterpretersStatus/>
          </div>

          <div className={`${styles.homeHeight} ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3`}>
            <Icon iconName='Clock' className='ms-Icon25' />
            <span className='ms-font-xxl'> <a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/reservations")}}>Reservations</a></span>
            <ReservationsStatus/>
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
