import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { NotebookStore } from './../../store/NotebookStore'
import CodeEditor from './../editor/CodeEditor'
import { toastr } from 'react-redux-toastr'
import InlineEditor from './../editor/InlineEditor'
import NotebookApi from './../../api/notebook/NotebookApi'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import * as isEqual from 'lodash.isequal'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ParagraphEditor extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private codeEditor
  private leftItems: any[] = []
  private rightItems: any[] = []

  state = {
    note: {
      id: ''
    },
    paragraph: {
      id: '',
      title: '',
      text: ''
    },
    index: -1,
    maxIndex: -1,
    focus: false,
    code: '',
    showControlBar: true,
    showParagraphTitle: false
  }

  public constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      paragraph: props.paragraph,
      index: props.index,
      maxIndex: props.maxIndex,
      focus: props.focus,
      code: '',
      showControlBar: props.showControlBar,
      showParagraphTitle: props.showParagraphTitle
    }
    var moveDown = {}
    if (props.index != props.maxIndex) {
      moveDown = {
        key: 'move-down-indicator',
        icon: 'ChevronDown',
        title: 'Move paragraph down',
        onClick: () => this.moveParagraphDown()
      }
    }
    var moveUp = {}
    if (props.index != 0) {
      moveUp = {
        key: 'move-up-indicator',
        icon: 'ChevronUp',
        title: 'Move paragraph up',
        onClick: () => this.moveParagraphUp()
      }
    }
    this.leftItems = [
      {
        key: 'run-indicator',
        icon: 'Play',
        title: 'Run the paragraph [SHIFT+Enter]',
        onClick: () => this.runParagraph()
      },
      {
        key: 'add-indicator',
        icon: 'Add',
        title: 'Add a paragraph',
        onClick: () => this.insertParagraph()
      },
      moveDown,
      moveUp,
      {
        key: '...',
        name: '...',
        title: 'Actions',
        items: [
/*
          {
            key: 'to-cover',
            name: 'Cover',
            icon: 'Heart',
            title: 'Cover',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
*/
          {
            key: 'clear',
            icon: 'ClearFormatting',
            name: 'Clear',
            title: 'Clear Content',
            onClick: () => this.clearParagraphOutput()
          },
          {
            key: 'delete',
            name: 'Delete',
            icon: 'Delete',
            title: 'Delete',
            onClick: () => this.removeParagraph()
          }
        ]
      }
    ]
    this.rightItems = []
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { index, note, paragraph, code, focus, showControlBar, showParagraphTitle } = this.state
    var title = 'Add an awesome title...'
    if (paragraph.title && (paragraph.title.length > 0)) {
      title = paragraph.title
    }
    return (
      <div className="ms-Grid" style={{margin: 0, padding: 0}}>
      <div className="ms-Grid-row" style={{margin: 0, padding: 0}}>
      <div key={paragraph.id}>
        {
        (showParagraphTitle == true) &&
        <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-textAlignLeft" style={{ padding: 0, margin: 0, overflow: 'hidden' }}>
          <div className="ms-font-l ms-fontWeight-semibold">
            <InlineEditor
              text={title}
              activeClassName="ms-font-l ms-fontWeight-semibold"
            />
          </div>
        </div>
        }
        {
        (showControlBar == true) && 
        <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-textAlignRight" style={{ padding: 0, margin: 0, overflow: 'hidden' }}>
          <div style={{marginLeft: '-20px'}}>
            <CommandBar
              isSearchBoxVisible={ false }
              items={ this.leftItems }
              farItems={ this.rightItems }
              className={ styles.commandBarBackgroundTransparent }
            />
          </div>
        </div>
        }
        <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{borderLeft: "4px solid #DDD"}}>
          <CodeEditor
            name={paragraph.id}
            note={note}
            paragraphs={[paragraph]}
            value={code}
            defaultValue=""
            minLines={1}
            maxLines={30}
            width="100%"
            mode="scala"
  //          theme="tomorrow"
            theme="tomorrow-night-eighties"
            fontSize="14px"
            showGutter={false}
            focus={focus}
  //          onLoad={this.onLoad}
  //          onChange={this.onChange}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false
            }}
            ref={ ref => { this.codeEditor = ref }}
            key={note.id + '-' + paragraph.id}
          />
        </div>
      </div>
      </div>
      </div>
    )

  }
  public componentWillReceiveProps(nextProps) {
    const { isStartRun } = nextProps
    if (isStartRun) {
      if (isStartRun.paragraphId == this.state.paragraph.id) {
        var code = this.codeEditor.getWrappedInstance().getValue()
        NotebookStore.state().isStartRun = null
        var p = this.state.paragraph
        this.notebookApi.runParagraph(p, code)
      }
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

  private runParagraph() {
    var code = this.codeEditor.getWrappedInstance().editor.getValue()
    this.notebookApi.runParagraph(this.state.paragraph, code)
    this.state.paragraph.text = code
  }

  private insertParagraph() {
    this.notebookApi.insertParagraph(this.state.index)
    this.notebookApi.getNote(this.state.note.id)
  }

  private moveParagraphUp() {
    this.notebookApi.moveParagraph(this.state.paragraph.id, this.state.index - 1)
    this.notebookApi.getNote(this.state.note.id)
  }

  private moveParagraphDown() {
    this.notebookApi.moveParagraph(this.state.paragraph.id, this.state.index + 1)
    this.notebookApi.getNote(this.state.note.id)
  }

  private removeParagraph() {
    this.notebookApi.removeParagraph(this.state.paragraph.id)
    this.notebookApi.getNote(this.state.note.id)
  }

  private clearParagraphOutput() {
    this.notebookApi.clearParagraphOutput(this.state.paragraph.id)
    this.notebookApi.getNote(this.state.note.id)
  }

}
