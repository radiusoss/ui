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
export default class ParagraphEditor extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private codeEditor

  state = {
    note: {
      id: ''
    },
    paragraph: {
      id: ''
    },
    code: ''
  }

  constructor(props) {    
    super(props)
    this.state = {
      note: props.note,
      paragraph: props.paragraph,
      code: ''
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { note, paragraph, code } = this.state
    return (
      <div key={paragraph.id}>
        <CodeEditor
          name={paragraph.id}
          note={note}
          paragraphs={[paragraph]}
          value={code}
          defaultValue=""
          minLines={5}
          maxLines={30}
          width="100%"
          mode="scala"
          theme="tomorrow"
          fontSize="14px"
          focus={false}
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
    const { isStartRun } = nextProps
    if (isStartRun) {
      console.log('isStartRun', isStartRun)
      if (isStartRun.paragraphId == this.state.paragraph.id) {
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
        NotebookStore.state().isStartRun = null
        this.notebookApi.runNote(this.state.note.id, paragraphs)
      }
    }
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

  @autobind
  private onLoad(editor) {
  }

  @autobind
  private onChange(newValue) {
  }

}
