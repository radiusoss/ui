import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import ParagraphResultsRenderer from './paragraph/ParagraphResultsRenderer'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteResultsRenderer extends React.Component<any, any> {
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
    var {note, showCommandBar} = this.state
    if (!note.paragraphs) {
      return <div></div>
    }
    return (
      <div>
        {
          note.paragraphs.map( p => {
            return (
              <div key={p.id}>
{/*
                <br/>
                <div className="ms-fontSize-xl">{p.title}</div>
*/}
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
    const { note, webSocketMessageSent, webSocketMessageReceived } = nextProps
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
        var updatedParagraphs = this.state.note.paragraphs.map( p => {
          if (p.id == paragraph.id) return paragraph
          return p
        })
        this.setState({
          note: {
            id: note.id,
            paragraphs: updatedParagraphs
          }
        })
        var runningParagraphs = NotebookStore.state().runningParagraphs
        var updatedRunningParagraphs = []
        for (var i = 0; i < runningParagraphs.length; i++) {
          if (paragraph.id !== runningParagraphs[i].id) {
            updatedRunningParagraphs = updatedRunningParagraphs.concat(runningParagraphs[i])
          }
          else {
            if (paragraph.status != 'FINISHED') {
              updatedRunningParagraphs = updatedRunningParagraphs.concat(runningParagraphs[i])
            }
          }
        }
        NotebookStore.state().runningParagraphs = updatedRunningParagraphs
        return
      }
    }
    if (note && note.paragraphs) {
      if (note.id !== this.state.note.id) {
        this.setState({
          note: note
        })
        return
      }
      if (this.state.note.paragraphs.length == 0) {
        if (note.paragraphs) {
          this.setState({
            note: {
              paragraphs: note.paragraphs
            }
          })
          return
        }
      }
    }
  }

}
