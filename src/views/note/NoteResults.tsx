import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import ParagraphDisplay from './../paragraph/ParagraphDisplay'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class   extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    note : {
      id: '',
      paragraphs: [{
        id: '',
        title: ''
      }]
    },
    showControlBar: false,
    showGraphBar: false,
    showParagraphTitle: false
  }

  public constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      showControlBar: props.showControlBar,
      showGraphBar: props.showGraphBar,
      showParagraphTitle: props.showParagraphTitle
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    var {note, showControlBar, showGraphBar, showParagraphTitle} = this.state
    if (!note.paragraphs) {
      return <div></div>
    }
    return (
      <div>
        {
          note.paragraphs.map( p => {
            return (
              <div key={p.id}>
                <ParagraphDisplay 
                  note={note}
                  paragraph={p} 
                  showControlBar={showControlBar} 
                  showGraphBar={showGraphBar} 
                  showParagraphTitle={showParagraphTitle} 
                  stripDisplay={false}
                  />
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
    const { note, spitfireMessageSent, spitfireMessageReceived } = nextProps
    if (spitfireMessageSent) {
      if (spitfireMessageSent.op == "RUN_ALL_PARAGRAPHS_SPITFIRE") {
        this.setState({
          note: {
            id: spitfireMessageSent.data.noteId,
            paragraphs: spitfireMessageSent.data.paragraphs
          }
        })
        return
      }
    }
    if (spitfireMessageReceived) {
      if (spitfireMessageReceived.op == "PARAGRAPH") {
        var paragraph = spitfireMessageReceived.data.paragraph
        var updatedParagraphs = this.state.note.paragraphs.map( p => {
          if (p.id == paragraph.id) {
            return paragraph
          }
          else {
            return p
          }
        })
        this.setState({
          note: {
            id: note.id,
            paragraphs: updatedParagraphs
          }
        })
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
