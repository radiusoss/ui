import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import ParagraphResults from './../results/ParagraphResults'

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
                <ParagraphResults paragraph={p} showCommandBar={showCommandBar} showParagraphTitle={false}/>
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
      this.state.note.paragraphs = []
    }
    if (webSocketMessageSent) {
      if (webSocketMessageSent.op == "RUN_ALL_PARAGRAPHS_SPITFIRE") {
        webSocketMessageSent.data.paragraphs.map(p => {
          this.state.note.paragraphs.unshift(p)
        })
      }
    }
    if (webSocketMessageReceived) {
      if (webSocketMessageReceived.op == "PARAGRAPH") {
        var paragraph = webSocketMessageReceived.data.paragraph
        var n = this.state.note
        for (var i = 0; i < n.paragraphs.length; i++) {
          if (n.paragraphs[i].id == paragraph.id) {
            this.state.note.paragraphs[i] = paragraph
          }
        }
      }
    }
  }

}
