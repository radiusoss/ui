import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NoteEditor from './editor/NoteEditor'
import NoteRenderer from './renderer/NoteRenderer'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteTilesLayout extends React.Component<any, any> {

  state = {
    note: {
      id: '',
      paragraphs: []
    }
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { note } = this.state
    return (
      <div>
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className={`${styles.editorHeight} ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px' }}>
              <NoteEditor note={note} />
            </div>
            <div className={`${styles.rendererHeight} ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px', overflowY: 'scroll' }} >
              <NoteRenderer note={note} />
            </div>
          </div>
        </div>
      </div>
    )
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
