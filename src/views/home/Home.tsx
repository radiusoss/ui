import * as React from 'react'
import history from './../../history/History'
import { toastr } from 'react-redux-toastr'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import NotebookApi from './../../api/notebook/NotebookApi'
import ScratchpadDisplay from './../scratchpad/ScratchpadDisplay'
import K8SClusterHealth from './../cluster/K8SClusterHealth'
import ReservationsStatus from './../reservations/ReservationsStatus'
import SparkStatus from './../spark/SparkStatus'
import ParagraphDisplay from './../paragraph/ParagraphDisplay'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import * as stylesImport from './../_styles/Styles.scss'
import { NotebookStore } from '../../store/NotebookStore';
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Home extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    scratchpad: {
      id: '',
      paragraphs: []
    },
    latestNote: null,
    latestParagraph: null
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { scratchpad, latestNote, latestParagraph } = this.state
    return (
      <div className={`ms-Grid ms-fadeIn500`}>
        <div className="ms-Grid-row">
          <div className={`${styles.homeHeight} ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`}>
          <Icon iconName='Parachute' className='ms-Icon25' />
            <span className='ms-font-xxl'>
              &nbsp;<a href="" onClick={(e) => {e.preventDefault(); this.notebookApi.showNoteLayout(latestNote.id, 'workbench')}}>Latest Note</a>
            </span>
            { (latestParagraph)  && 
            <div>
              <div className='ms-fontSize-xl'>{latestNote.title}</div>
              <ParagraphDisplay
                note={ latestNote }
                paragraph={ latestParagraph }
                showControlBar={false} 
                showGraphBar={true} 
                showParagraphTitle={false} 
                stripDisplay={true}
                />
              </div>
            }
            <hr/>
            <Icon iconName='NoteForward' className='ms-Icon25' />
            <span className='ms-font-xxl'>
              &nbsp;<a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/explorer/scratchpad")}}>Scratchpad</a>
            </span>
            { (scratchpad.paragraphs.length > 0)  && 
              <ScratchpadDisplay 
                  showGraphBar={false}
                  showControlBar={false}
                  showParagraphTitle={false}
                  note={scratchpad} 
                />
            }
          </div>
          <div className={`${styles.homeHeight} ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3`}>
            <Icon iconName='Clock' className='ms-Icon25' />
            <span className='ms-font-xxl'>
              &nbsp;<a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/reservations")}}>Reservations</a>
            </span>
            <ReservationsStatus/>
          </div>
          <div className={`${styles.homeHeight} ms-Grid-col ms-u-sm3 ms-u-md3 ms-u-lg3`}>
            <Icon iconName='Health' className='ms-Icon25' />
            <span className='ms-font-xxl'>
              &nbsp;<a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/status")}}>Cluster</a>
            </span>
            <K8SClusterHealth />
{/*
            <Icon iconName='LightningBolt' className='ms-Icon25' />
            <span className='ms-font-xxl'>
              &nbsp;<a href="" onClick={(e) => {e.preventDefault(); history.push("/dla/kuber/status")}}>Spark</a>
            </span>
            <SparkStatus/>
*/}
            </div>
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.notebookApi.listNotes()
    this.notebookApi.getNote(NotebookStore.state().scratchpadNoteId)
  }

  public componentWillReceiveProps(nextProps) {
    const { spitfireMessageReceived } = nextProps
    if (! spitfireMessageReceived) return
    if (spitfireMessageReceived.op == "NOTE") {
      var note = spitfireMessageReceived.data.note
      if (note.id == NotebookStore.state().scratchpadNoteId) {
        this.setState({
          scratchpad: note
        })
      }
    }
    if (spitfireMessageReceived && spitfireMessageReceived.op == "NOTES_INFO") {
      var notes = spitfireMessageReceived.data.notes.filter(n => !n.name.startsWith('_'))
      var latestParagraph = null
      var latestNote = null
      notes.map(n =>  {
        if (latestParagraph == null) {
          latestNote = n
          latestParagraph = n.p
        }
        else {
          if (n.p.dateFinished > latestParagraph.dateFinished) {
            latestNote = n
            latestParagraph = n.p
          }
        }
      })
      this.setState({
        notes: notes,
        latestNote: latestNote,
        latestParagraph: latestParagraph
      })
    }
  }
  
}
