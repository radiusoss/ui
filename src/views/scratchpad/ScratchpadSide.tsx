import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import ScratchpadEditorSide from './ScratchpadEditorSide'
import ScratchpadDisplaySide from './ScratchpadDisplaySide'
import NotebookApi from './../../api/notebook/NotebookApi'
import { NotebookStore } from './../../store/NotebookStore'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteScratchpadSide extends React.Component<any, any> {
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
    if (note.id) {
      return (
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ paddingLeft: '0px', margin: '0px' }}>
              <ScratchpadEditorSide 
                note={note} 
                minLines={10}
                maxLines={20}
                height="100%"
                showGutter={false}
                fontSize={10}
                />
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ paddingLeft: '0px', margin: '0px', overflowY: 'scroll' }} >
              <ScratchpadDisplaySide
                note={note} 
                showGraphBar={true}
                showControlBar={false}
                showParagraphTitle={false}
                stripDisplay={false}
                />
            </div>
          </div>
        </div>
      )
    }
    else {
      return <div></div>
    }
  }

  public componentDidMount() {
    this.notebookApi.getNote(NotebookStore.state().scratchpadNoteId)
  }

  public componentWillReceiveProps(nextProps) {
    const { spitfireMessageReceived } = nextProps
    if (! spitfireMessageReceived) return
    if (spitfireMessageReceived.op == "NOTE") {
      if (spitfireMessageReceived.data.note.id == NotebookStore.state().scratchpadNoteId) {
        this.setState({
          note: spitfireMessageReceived.data.note
        })
      }
    }
  }

}
