import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import ParagraphEditor from './editor/ParagraphEditor'
import ParagraphResultsRenderer from './renderer/paragraph/ParagraphResultsRenderer'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteLinesLayout extends React.Component<any, any> {

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
    if (note.id) {
      return (
        <div>
          {
            note.paragraphs.map(p => {
              return (
                <div className="ms-Grid">
                  <div className="ms-Grid-row">
                    <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px' }}>
                      <ParagraphEditor note={note} paragraph={p}/>
                    </div>
                    <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px', overflowY: 'scroll' }} >
                      <ParagraphResultsRenderer paragraph={p} showCommandBar={true}/>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
    else {
      return <div></div>
    }
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
