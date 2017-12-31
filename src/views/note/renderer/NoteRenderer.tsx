import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from '../../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../../actions/NotebookActions'
import NotebookApi from './../../../api/notebook/NotebookApi'
import ParagraphRenderer from './paragraph/ParagraphRenderer'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteRenderer extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    note : {
      id: '',
      paragraphs: [{
        id: ''
      }]
    }
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["notebookApi"]
  }

  public render() {

    if (!this.state.note.paragraphs) {
      return <div></div>
    }

    return (
      <div>
        {
          this.state.note.paragraphs.map( p => {
            return (
              <div key={p.id}>
                <ParagraphRenderer paragraph={p} />
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
        let paragraph = webSocketMessageReceived.data.paragraph
        let updatedParagraphs = this.state.note.paragraphs.map( p => {
          if (p.id == paragraph.id) return paragraph
          return p
        })
        this.setState({
          note: {
            id: note.id,
            paragraphs: updatedParagraphs
          }
        })

        let runningParagraphs = NotebookStore.state().runningParagraphs
        let updatedRunningParagraphs = []
        for (let i = 0; i < runningParagraphs.length; i++) {
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
