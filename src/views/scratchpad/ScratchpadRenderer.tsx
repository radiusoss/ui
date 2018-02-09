import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import ParagraphResultsRenderer from './../renderer/paragraph/ParagraphResultsRenderer'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ScratchpadRenderer extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    note : {
      id: '',
      paragraphs: [{
        id: '',
        title: ''
      }]
    },
    showCommandBar: true
  }

  public constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      showCommandBar: props.showCommandBar
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    var { note, showCommandBar } = this.state
    if (!note.paragraphs) {
      return <div></div>
    }
    return (
      <div>
        {
          note.paragraphs.map( p => {
            return (
              <div key={p.id}>
                <ParagraphResultsRenderer paragraph={p} showCommandBar={showCommandBar}/>
              </div>
            )
          })
        }
      </div>
    )
  }

  public componentWillUnmount() {
    this.setState({
      note: {
        id: '',
        paragraphs: []
      }
    })
  }

  public componentWillReceiveProps(nextProps) {
    const { note, webSocketMessageSent, webSocketMessageReceived, clearScratchpad } = nextProps
    if (clearScratchpad) {
      var n = this.state.note
      n.paragraphs = []
      this.setState({
        note: n
      })
    }
    if (webSocketMessageSent) {
      if (webSocketMessageSent.op == "RUN_ALL_PARAGRAPHS_SPITFIRE") {
        this.setState({
          note: {
            id: webSocketMessageSent.data.noteId,
            paragraphs: webSocketMessageSent.data.paragraphs
          }
        })
        return
      }
    }
    if (webSocketMessageReceived) {
      if (webSocketMessageReceived.op == "PARAGRAPH") {
        var paragraph = webSocketMessageReceived.data.paragraph
        var n = this.state.note
        var pid = -1
        for (var i = 0; i < n.paragraphs.length; i++) {
          if (n.paragraphs[i].id == paragraph.id) {
            pid = i
          }
        }
        if (pid == -1) {
          n.paragraphs.unshift(paragraph)
        } else {
          n.paragraphs[pid] = paragraph
        }
        console.log('---', pid)
        console.log('---', n)
        this.setState({
          note: n
        })
        return
      }
    }
  }

}
