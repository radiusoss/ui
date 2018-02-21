import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { NotebookStore } from './../../store/NotebookStore'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import CodeEditor from './../editor/CodeEditor'
import { toastr } from 'react-redux-toastr'
import { ParagraphStatus } from './ParagraphStatus'
import InlineEditor from './../editor/InlineEditor'
import NotebookApi from './../../api/notebook/NotebookApi'
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import * as isEqual from 'lodash.isequal'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport
// import * as stylesImport2 from './CommandBar.scss'
// const styles2: any = stylesImport2

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook, null, { withRef: true })
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
      text: '',
      status: '',
      config: {
        editorHide: false,
        colWidth: '12'
      }
    },
    index: -1,
    maxIndex: -1,
    focus: false,
    code: '',
    showControlBar: true,
    showParagraphTitle: false,
    showPanel: false
  }

  public constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      paragraph: props.paragraph,
      index: props.index,
      maxIndex: props.maxIndex,
      focus: props.focus,
      code: props.paragraph.text,
      showControlBar: props.showControlBar,
      showParagraphTitle: props.showParagraphTitle,
      showPanel: false
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {

    const { index, maxIndex, note, paragraph, code, focus, showControlBar, showParagraphTitle, showPanel } = this.state

    var panelTitle = 'Add an awesome title...'
    if (paragraph.title && (paragraph.title.length > 0)) {
      panelTitle = paragraph.title
    }

    var leftItems: any[] = []

    if (this.isParagraphRunning(paragraph)) {
      leftItems.push({
        key: 'cancel-indicator',
        icon: 'CirclePause',
        title: 'Cancel',
        onClick: () => this.cancelParagraph()
      })
    }
    else {
      leftItems.push({
        key: 'run-indicator',
        icon: 'Play',
        title: 'Run the paragraph [SHIFT+Enter]',
        onRenderIcon: (iconProps) => { return <i className="my-button"></i>},
        onClick: () => this.runParagraph()
      })
    }
    leftItems.push({
      key: 'add-indicator',
      icon: 'Add',
      title: 'Add a paragraph',
      onClick: () => this.insertParagraph()
    })
    if (index != maxIndex) {
      leftItems.push({
        key: 'move-down-indicator',
        icon: 'ChevronDown',
        title: 'Move Paragraph Down',
        onClick: () => this.moveParagraphDown()
      })
    }
    if (index != 0) {
      leftItems.push({
        key: 'move-up-indicator',
        icon: 'ChevronUp',
        title: 'Move Paragraph Up',
        onClick: () => this.moveParagraphUp()
      })
    }
/*
    {
      key: 'to-cover',
      name: 'Cover',
      icon: 'Heart',
      title: 'Cover',
      onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
    },
*/
    if (paragraph.config.editorHide) {
      leftItems.push({
        key: 'show-editor',
        icon: 'FieldNotChanged',
        title: 'Show Editor',
        onClick: () => this.toggleEditorShow()
      })
    }
    else {
      leftItems.push({
        key: 'hide-editor',
        icon: 'FieldEmpty',
        title: 'Hide Editor',
        onClick: () => this.toggleEditorShow()
      })
    }
    
    leftItems.push(
      {
        key: 'clear',
        icon: 'ClearFormatting',
        title: 'Clear Paragraph Output',
        onClick: () => this.clearParagraphOutput()
      },
      {
        key: 'delete',
        icon: 'Delete',
        title: 'Delete Paragraph',
        onClick: () => this.removeParagraph()
      },
      {
        key: 'panel',
        icon: 'SidePanelMirrored',
        title: 'Show Control Panel',
        onClick: () => this.setState({showPanel: true})
      }
    )

    var rightItems: any[] = []

    var display = 'inline'
    if (paragraph.config.editorHide == true) {
      display = 'none'
    }

    var statusColor = "tealLight"
    if (paragraph.status == ParagraphStatus.ERROR) {
      statusColor = "red"
    }
    else if (paragraph.status == ParagraphStatus.PENDING) {
      statusColor = "magenta"
    }
    else if (paragraph.status == ParagraphStatus.ABORT) {
      statusColor = "orangeLighter"
    }

    return (

      <div>

        <Panel
          isOpen={ showPanel }
          type={ PanelType.smallFixedFar }
          headerText="Paragraph"
          onDismiss={() => this.setState({showPanel: false})}
        >
          <div>
            <div className="ms-font-xl">
              <InlineEditor
                text={panelTitle}
                paramName="title"
                minLength={0}
                maxLength={50}
                change={this.updateTitle}
                activeClassName="ms-font-xl"
              />
            </div>
            <div style={{ width: '10px', float: 'left'}}>
              <SpinButton
                value={ parseInt(paragraph.config.colWidth).toString() }
//                defaultValue='12'
                label={ 'Width' }
                min={ 9 }
                max={ 12 }
                step={ 3 }
                onIncrement={(value) => {
                  var nextValue = (parseInt(value) + 3).toString()
                  this.updateColWidth(nextValue)
                  return nextValue
                }}
                onDecrement={(value) => {
                  var nextValue = (parseInt(value) - 3).toString()
                  this.updateColWidth(nextValue)
                  return nextValue
                }}
                onValidate={(value) => {
                  var v = parseInt(value)
                  if (isNaN(v)) {
                    return
                  } else {
                    if ((v < 3) || (v > 12)) {
                      return
                    }
                    var vs = v.toString()
                    this.updateColWidth(vs)
                    return vs
                  }
                }}
              />
            </div>
          </div>
        </Panel>

        <div className="ms-Grid" 
          style={{margin: 0, padding: 0}}
  //        key={'pe_' + note.id + '-' + paragraph.id + "-" + index + '-' + paragraph.status + '-' + paragraph.config.colWidth}
          >
          <div className="ms-Grid-row" style={{margin: 0, padding: 0}}>
            <div>
              {
              (showParagraphTitle == true) &&
              <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 ms-textAlignLeft" style={{ padding: 0, margin: 0, overflow: 'hidden' }}>
                <div className="ms-font-l ms-fontWeight-semibold" style={{transform: 'translateY(-7px)'}}>
                  <InlineEditor
                    text={paragraph.title}
                    paramName="title"
                    minLength={3}
                    maxLength={50}
                    change={this.updateTitle}
                    activeClassName="ms-font-l ms-fontWeight-semibold"
                  />
                </div>
              </div>
              }
              <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8 ms-textAlignRight" style={{ padding: 0, margin: 0, overflow: 'hidden', maxHeight: '20px' }}>
                <div className={`ms-fontColor-neutralTertiary ms-fontColor-` + statusColor} style={{ float: 'right' }}>
                  {paragraph.status}
                </div>
                {
                (showControlBar == true) &&
                  <div style={{ minWidth: '100px', marginLeft: '0px', float: 'right', maxHeight: '10px', marginBottom: '10px', transform: 'scale(0.85) translateY(-8px) translateX(60px)', }}>
                    <CommandBar
                      isSearchBoxVisible={ false }
                      items={ leftItems }
                      farItems={ rightItems }
                      className={ styles.commandBarBackgroundTransparent }
                    />
                  </div>
                }
              </div>
              <div style ={{display: display}}>
                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{borderLeft: "4px solid #DDD", padding: 0, margin: 0}}>
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
                    theme="tomorrow"
    //              theme="tomorrow-night-eighties"
                    fontSize="14"
                    showGutter={false}
                    focus={focus}
    //              onLoad={this.onLoad}
    //              onChange={this.onChange}
                    setOptions={{
                      enableBasicAutocompletion: false,
                      enableLiveAutocompletion: false
                    }}
                    ref={ ref => { this.codeEditor = ref }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )

  }

  public getCodeEditorContent() {
    return this.codeEditor.getWrappedInstance().getValue()
  }

  public componentWillReceiveProps(nextProps) {
    const { isStartParagraphRun, webSocketMessageReceived } = nextProps
    if (isStartParagraphRun) {
      if (isStartParagraphRun.paragraphId == this.state.paragraph.id) {
        var code = this.getCodeEditorContent()
        NotebookStore.state().isStartParagraphRun = null
        var p = this.state.paragraph
        this.notebookApi.runParagraph(p, code)
      }
    }
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH")) {
      var paragraph = webSocketMessageReceived.data.paragraph
      if (paragraph.id == this.state.paragraph.id) {        
        this.setState({
          paragraph: paragraph
        })
      }
    }
  }

  @autobind
  private onLoad(editor) {
  }

  @autobind
  private onChange(newValue) {
  }

  private updateColWidth(colWidth: string) {
    var paragraph = this.state.paragraph
    paragraph.config.colWidth = colWidth
    this.notebookApi.commitParagraph(paragraph)
    this.notebookApi.getNote(this.state.note.id)
  }

  private runParagraph() {
    var code = this.codeEditor.getWrappedInstance().editor.getValue()
    this.notebookApi.runParagraph(this.state.paragraph, code)
    this.state.paragraph.text = code
  }

  private cancelParagraph() {
    this.notebookApi.cancelParagraph(this.state.paragraph.id)
  }

  private insertParagraph() {
    this.notebookApi.insertParagraph(this.state.index)
    this.notebookApi.getNote(this.state.note.id)
  }

  private moveParagraphUp() {
    this.notebookApi.moveParagraph(this.state.paragraph.id, this.state.index - 1)
    this.notebookApi.getNote(this.state.note.id)
  }

  private toggleEditorShow() {
    this.state.paragraph.config.editorHide = ! this.state.paragraph.config.editorHide
    this.notebookApi.commitParagraph(this.state.paragraph)
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

  private newParagraph(noteId, i, text) {
    return {
      'id': noteId + '_' + i,
      'jobName': 'paragraph_' + noteId + '_' + i,
      'text': text.replace(/^\s+|\s+$/g, ''),
      'params': {},
      'user': 'anonymous',
      'config': {
        'colWidth': "12",
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
  private updateTitle(message) {
    this.state.paragraph.title = message.title
    this.notebookApi.commitParagraph(this.state.paragraph)
  }

  private isParagraphRunning(paragraph) {
    if (!paragraph) return false
    var status = paragraph.status
    if (!status) return false
    return status === ParagraphStatus.PENDING || status === ParagraphStatus.RUNNING
  }  

}
