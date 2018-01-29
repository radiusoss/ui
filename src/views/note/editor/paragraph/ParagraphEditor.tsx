import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../../actions/NotebookActions'
import { NotebookStore } from './../../../../store/NotebookStore'
import CodeEditor from './code/CodeEditor'
import NotebookApi from './../../../../api/notebook/NotebookApi'
import * as isEqual from 'lodash.isequal'
import * as stylesImport from './../../../_styles/Styles.scss'
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
      id: '',
      title: '',
      text: ''
    },
    focus: false,
    code: ''
  }

  constructor(props) {    
    super(props)
    console.log('focus', props.focus)
    this.state = {
      note: props.note,
      paragraph: props.paragraph,
      focus: props.focus, 
      code: ''
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { note, paragraph, code, focus } = this.state
    return (
      <div key={paragraph.id}>
        <div className="ms-fontSize-xl">{paragraph.title}</div>
        <CodeEditor
          name={paragraph.id}
          note={note}
          paragraphs={[paragraph]}
          value={code}
          defaultValue=""
          minLines={5}
          maxLines={60}
          width="100%"
          mode="scala"
          theme="tomorrow"
          showGutter={false}
          fontSize="14px"
          focus={focus}
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
      if (isStartRun.paragraphId == this.state.paragraph.id) {
        let code = this.codeEditor.getWrappedInstance().getValue()
        NotebookStore.state().isStartRun = null
        var p = this.state.paragraph
        this.notebookApi.runParagraph(p, code)
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
