import * as React from 'react'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { NotebookStore } from './../../store/NotebookStore'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import CodeEditor from './../editor/CodeEditor'
import { toastr } from 'react-redux-toastr'
import { ParagraphStatus, isParagraphRunning, getStatusClassNames } from './ParagraphUtil'
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator'
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
    showPanel: false,
    percentComplete: 0,
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
      showPanel: false,
      percentComplete: 0,
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {

    const { index, maxIndex, note, paragraph, code, focus, showControlBar, showParagraphTitle, showPanel, percentComplete } = this.state

    var panelTitle = 'Add an awesome title...'
    if (paragraph.title && (paragraph.title.length > 0)) {
      panelTitle = paragraph.title
    }

    var leftItems: any[] = []

    if (isParagraphRunning(paragraph)) {
      leftItems.push({
        key: 'cancel-indicator',
        icon: 'Cancel',
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

    var statusClassNames = getStatusClassNames(paragraph)

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
            <div><hr/></div>
            <div>
              {
              (index != maxIndex) && 
                <IconButton
                  iconProps={{
                    iconName: 'ChevronDown'
                  }}
                  key='move-down-indicator'
                  title='Move Paragraph Down'
                  onClick={() => this.moveParagraphDown()}
                  />
              }
              {
              (index != 0) && 
                <IconButton
                  iconProps={{
                    iconName: 'ChevronUp'
                  }}
                  key='move-up-indicator'
                  title='Move Paragraph Up'
                  onClick={() => this.moveParagraphUp()}
                  />
              }
              {
                <IconButton
                  iconProps={{
                    iconName: 'ClearFormatting'
                  }}
                  key='clear'
                  title='Clear Paragraph Output'
                  onClick={() => this.clearParagraphOutput()}
                  />
              }
              {
                <IconButton
                  iconProps={{
                    iconName: 'Delete'
                  }}
                  key='delete'
                  title='Delete This Paragraph'
                  onClick={() => this.removeParagraph()}
                  />
              }
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
          >
          <div className="ms-Grid-row" style={{margin: 0, padding: 0}}>
            <div>
              {
              (showParagraphTitle == true) &&
              <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 ms-textAlignLeft" style={{ padding: 0, margin: 0, overflow: 'hidden' }}>
                <div className="ms-font-l ms-fontWeight-semibold" style={{transform: 'translateY(-6px)'}}>
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
                <div className={`ms-fontColor-neutralTertiary ` + statusClassNames} style={{ float: 'right' }}>
                  { paragraph.status }
                  { isParagraphRunning(paragraph) &&  ' ' + percentComplete + '%' }
                </div>
                {
                (showControlBar == true) &&
                  <div style={{ marginLeft: '0px', float: 'right', maxHeight: '10px', marginBottom: '10px', transform: 'scale(0.85) translateY(-9px) translateX(60px)', }}>
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
                    maxLines={200}
                    width="100%"
                    mode="scala"
                    theme="tomorrow"
    //              theme="tomorrow-night-eighties"
                    fontSize={12}
                    showGutter={false}
                    focus={focus}
    //              onLoad={this.onLoad}
    //              onChange={this.onChange}
                    wrapEnabled={true}
                    setOptions={{
                      enableBasicAutocompletion: false,
                      enableLiveAutocompletion: false
                    }}
                    ref={ ref => { this.codeEditor = ref }}
                  />
                </div>
              </div>
              {
              (isParagraphRunning(paragraph)) && 
              <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ padding: 0, margin: 0 }}>
                <ProgressIndicator
                  percentComplete={ percentComplete / 100 }
                />
              </div>
              }
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
    const { isStartParagraphRun, spitfireMessageReceived } = nextProps
/*
    if (isStartParagraphRun) {
      if (isStartParagraphRun.paragraphId == this.state.paragraph.id) {
        if (!isParagraphRunning(this.state.paragraph)) {
          var code = this.getCodeEditorContent()
          this.notebookApi.runParagraph(this.state.paragraph, code)
          this.state.paragraph.status = ParagraphStatus.PENDING
        }
      }
    }
*/
    if (spitfireMessageReceived && (spitfireMessageReceived.op == "PROGRESS")) {
      var data = spitfireMessageReceived.data
      if (data.id == this.state.paragraph.id) {
        this.setState({
          percentComplete: data.progress
        })
      }
    }
    if (spitfireMessageReceived && (spitfireMessageReceived.op == "PARAGRAPH")) {
      var paragraph = spitfireMessageReceived.data.paragraph
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
    this.state.paragraph.text = code
    this.props.dispatchRunParagraphAction(this.state.note.id, this.state.paragraph.id)
  }

  private cancelParagraph() {
    this.notebookApi.cancelParagraph(this.state.paragraph.id)
  }

  private insertParagraph() {
    this.notebookApi.insertParagraph(this.state.index + 1)
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

  @autobind
  private updateTitle(message) {
    this.state.paragraph.title = message.title
    this.notebookApi.commitParagraph(this.state.paragraph)
  }

}
