import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../actions/NotebookActions'
import { NotebookStore } from './../../../store/NotebookStore'
import CodeEditor from './paragraph/code/CodeEditor'
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
      id: '',
      paragraphs: []
    },
    paragraphs: [],
    code: ''
  }

  constructor(props) {    
    super(props)
    this.state = {
      note: props.note,
      paragraphs: props.note.paragraphs,
      code: ''
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
          height="100%"
          width="100%"
          mode="scala"
          theme="tomorrow"
          showGutter={true}
          fontSize="14px"
          focus={true}
          readOnly={true}
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
/*
  public shouldComponentUpdate(nextProps, nextState) {
    const { note } = nextProps
    if (!note.data) {
      return false
    }
  }
*/
  public componentWillReceiveProps(nextProps) {
    const { isStartRun } = nextProps
    if (isStartRun) {
      let lines = this.codeEditor.getWrappedInstance().getValue().split(/\r?\n/)
      let paragraphs = []
      let paragraph = {}
      let code = ''
      for (var i = 0; i < lines.length; i++) {
        let line = lines[i]
        if ((line.indexOf('%') == 0) && (i != 0)) {
          paragraphs.push(this.newParagraph(this.state.note.id, i, code))
          code = ''
        }
        code = code + '\n' + line
      }
      paragraphs.push(this.newParagraph(this.state.note.id, i, code))
      NotebookStore.state().isStartRun = null,
      this.notebookApi.runNote(this.state.note.id, paragraphs)
    }
  }

  private newParagraph(noteId, i, code) {
    return {
      'id': noteId + '_' + i,
      'jobName': 'paragraph_' + noteId + '_' + i,
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
