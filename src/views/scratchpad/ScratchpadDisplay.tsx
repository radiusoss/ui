import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { toastr } from 'react-redux-toastr'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import ParagraphDisplay from './../paragraph/ParagraphDisplay'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ScratchpadDisplay extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    note : {
      id: '',
      paragraphs: [{
        id: '',
        title: ''
      }]
    },
    showGraphBar: true,
    showParagraphTitle: false,
    showControlBar: false,
    stripDisplay: false
  }

  public constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      showGraphBar: props.showGraphBar,
      showControlBar: props.showControlBar,
      showParagraphTitle: props.showParagraphTitle,
      stripDisplay: props.stripDisplay
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    var { note, showGraphBar, showControlBar, showParagraphTitle, stripDisplay } = this.state
    var i = -1
    if (!note.paragraphs) {
      return <div></div>
    }
    return (
      <div>
        {
          note.paragraphs.map( p => {
            i++
            return (
              <div key={p.id + '-' + i}>
                <ParagraphDisplay 
                  note={note}
                  paragraph={p} 
                  showGraphBar={showGraphBar} 
                  showControlBar={showControlBar} 
                  showParagraphTitle={showParagraphTitle} 
                  stripDisplay={stripDisplay}
                  key={p.id + '-' + i}
                />
                <hr/>
              </div>
            )
          })
        }
      </div>
    )
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
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "INTERPRETER_BINDINGS")) {
      var bind = false
      webSocketMessageReceived.data.interpreterBindings.map(intBind => {
        if (intBind.selected == false) {
          bind = true
        }
      })
      if (bind) {
        var ids = webSocketMessageReceived.data.interpreterBindings.map(intBind => {return intBind.id})
        this.notebookApi.saveInterpreterBindings(this.state.note.id, ids)
        toastr.info('Interpreters', 'Interpreters Bindings to current note is requested - Try again...')
      } else {
        toastr.warning('Interpreters', 'All interpreters are already binded to current note - Try to restart interpreters.')
      }
    }
  }

}
