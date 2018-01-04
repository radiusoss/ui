import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../actions/NotebookActions'
import { NotebookStore } from './../../../store/NotebookStore'
import CodeEditor from './code/CodeEditor'
import NotebookApi from './../../../api/notebook/NotebookApi'
import * as isEqual from 'lodash.isequal'
import * as stylesImport from './../../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteEditor extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private codeEditor

  state = {
    note: {
      id: ''
    },
    text: ''
  }

  constructor(props) {    
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { note, text } = this.state
    return (
      <div className={styles.editorHeight}>
        <CodeEditor
          name={note.id}
          value={text}
          defaultValue=""
          height="100%"
          width="100%"
          mode="scala"
          theme="tomorrow"
          fontSize="14px"
          focus={true}
//              onLoad={this.onLoad}
//              onChange={this.onChange}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false
          }}
          ref={ ref => this.codeEditor = ref }
        />
      </div>
    )

  }

  public shouldComponentUpdate(nextProps, nextState) {
    const { note } = nextProps
    if (!note.data) {
      return false
    }
  }

  public componentWillReceiveProps(nextProps) {

    const { note, isStartRun } = nextProps

    if (note.id) {
      this.setState({
        note: note
      })
    }

    if (isStartRun) {
      let lines = this.codeEditor.getWrappedInstance().getValue().split(/\r?\n/)
      let paragraphs = []
      let paragraph = {}
      let text = ''
      let noteId = this.state.note.id
      for (var i = 0; i < lines.length; i++) {
        let line = lines[i]
        if ((line.indexOf('%') == 0) && (i != 0)) {
          paragraphs.push(this.newParagraph(noteId, i, text))
          text = ''
        }
        text = text + '\n' + line
      }
      paragraphs.push(this.newParagraph(noteId, i, text))
      NotebookStore.state().isStartRun = false
      this.notebookApi.runNote(noteId, paragraphs)
    }

  }

  @autobind
  private onLoad(editor) {
  }

  @autobind
  private onChange(newValue) {
  }
  
  private newParagraph(noteId, i, text) {
    return {
      'id': noteId + '_' + i,
      'jobName': 'paragraph_' + noteId + '_' + i,
      'text': text.replace(/^\s+|\s+$/g, ''),
      'params': {},
      'user': 'anonymous',
      'config': {
        'colWidth': 12.0,
        'enabled': true,
        'results': {},
        'editorSetting': {
          'language': 'scala'
        },
        'editorMode': 'ace/mode/scala'
      },
      'settings': {
        'params': {},
        'forms': {}
      },
      'apps': []
    }
  }

}
