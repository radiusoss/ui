import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import ScratchpadEditor from './ScratchpadEditor'
import ScratchpadDisplay from './ScratchpadDisplay'
import NotebookApi from './../../api/notebook/NotebookApi'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteScratchpad extends React.Component<any, any> {
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
            <div className={`${styles.editorHeight} ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px' }}>
              <ScratchpadEditor note={note} />
            </div>
            <div className={`${styles.rendererHeight} ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px', overflowY: 'scroll' }} >
              <ScratchpadDisplay 
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
