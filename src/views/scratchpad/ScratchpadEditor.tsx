import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { NotebookStore } from './../../store/NotebookStore'
import CodeEditor from './../editor/CodeEditor'
import NotebookApi from './../../api/notebook/NotebookApi'
import * as isEqual from 'lodash.isequal'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ScratchpadEditor extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private codeEditor

  state = {
    note: {
      id: '',
      paragraphs: []
    },
    paragraphs: [],
    code: '',
    lastParagraphId: -1
  }

  constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      paragraphs: props.note.paragraphs,
      code: '',
      lastParagraphId: new Date().getTime()
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { note, paragraphs, code } = this.state
    return (
      <div className={styles.editorHeight}>
        <CodeEditor
          name={note.id}
          note={note}
          paragraphs={paragraphs}
          value={code}
          defaultValue=""
          minLines={100}
          maxLines={200}
          height="100%"
          width="100%"
          mode="scala"
//          theme="tomorrow-night-eighties"
//          theme="tomorrow"
          theme="monokai"
          showGutter={true}
          fontSize="14px"
          focus={true}
          readOnly={false}
//          onLoad={this.onLoad}
//          onChange={this.onChange}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false
          }}
          ref={ ref => this.codeEditor = ref }
        />
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { isStartNoteRun, isStartParagraphRun } = nextProps
    if ((isStartNoteRun && isStartNoteRun.noteId ) || (isStartParagraphRun && isStartParagraphRun.paragraphId)) {
      var lines = this.codeEditor.getWrappedInstance().getValue().split(/\r?\n/)
      var pid = this.state.lastParagraphId
      var paragraphs = []
      var paragraph = {}
      var code = ''
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        if ((line.indexOf('%') == 0) && (i != 0)) {
          pid = pid + 1
          paragraphs.push(this.newParagraph(this.state.note.id, pid, code))
          code = ''
        }
        code = code + '\n' + line
      }
      pid = pid + 1
      paragraphs.push(this.newParagraph(this.state.note.id, pid, code))
      NotebookStore.state().isStartNoteRun = null,
      this.notebookApi.runAllParagraphsSpitfire(this.state.note.id, paragraphs)
      this.setState({
        lastParagraphId: pid
      })
    }
  }

  private newParagraph(noteId, paragraphId, code) {
    return {
      'id': noteId + '_' + paragraphId,
      'jobName': 'paragraph_' + noteId + '_' + paragraphId,
      'text': code.replace(/^\s+|\s+$/g, ''),
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

  @autobind
  private onLoad(editor) {
  }

  @autobind
  private onChange(newValue) {
  }

}
