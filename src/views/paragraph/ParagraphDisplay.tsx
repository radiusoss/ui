import * as React from 'react'
import history from './../../history/History'
import { NotebookStore } from './../../store/NotebookStore'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import HtmlDisplay from './../display/HtmlDisplay'
import ReactjsDisplay from './../display/ReactjsDisplay'
import { toastr } from 'react-redux-toastr'
import InlineEditor from './../editor/InlineEditor'
import { ParagraphStatus, isParagraphRunning, getExecutionMessage, getElapsedTime } from './ParagraphUtil'
import ImageDisplay from './../display/ImageDisplay'
import MathjaxDisplay from './../display/MathjaxDisplay'
import TableDisplay from './../display/TableDisplay'
import TextDisplay from './../display/TextDisplay'
import Spinner from './../../_widget/Spinner'
import NotebookApi from './../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook, null, { withRef: true })
export default class ParagraphDisplay extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
    note: {
      id: ''
    },
    paragraph: {
      id: '',
      title: '',
      user: '',
      errorMessage: '',
      dateStarted: '',
      dateFinished: '',
      dateUpdated: '',
      status: '',
      results: {
        msg: [{
          data: '',
          type: '',
        }]
      }
    },
    showControlBar: false,
    showParagraphTitle: false,
    showGraphBar: false,
    stripDisplay: false,
    showErrorDetail: false
  }

  public constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      paragraph: props.paragraph,
      showControlBar: props.showControlBar,
      showParagraphTitle: props.showParagraphTitle,
      showGraphBar: props.showGraphBar,
      stripDisplay: props.stripDisplay,
      showErrorDetail: false
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {

    const { paragraph, showControlBar, showGraphBar, showParagraphTitle, stripDisplay } = this.state

    var paragraphHeader = <div></div>
    var title = '[Add an awesome title]'
    var cl = "ms-font-l ms-fontWeight-light dla-ParagraphTitle"
    if (paragraph.title && (paragraph.title.length > 0)) {
      title = paragraph.title
      cl = "ms-font-xl ms-fontWeight-semibold"
    }

    paragraphHeader = <div>
      {
      (showParagraphTitle == true) && 
      <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-fontSize-xl ms-textAlignLeft" style={{ paddingLeft: '10px', margin: '0px', overflow: 'hidden' }}>
        <InlineEditor
          text={title}
          paramName="title"
          change={this.updateTitle}
          minLength={0}
          maxLength={33}
          activeClassName="ms-font-xl"
        />
      </div>
      }
      {
      (showControlBar == true) && <div></div>
      }
    </div>
    if (paragraph.status == ParagraphStatus.ERROR) {
      console.log("Paragraph Error.", this.state.paragraph, paragraph)
      var errorMessage = paragraph.errorMessage
      var detailedErrorMessage = "No Detail Available for the Returned Message."
      if (paragraph.results && paragraph.results.msg && paragraph.results.msg.length > 0) {
        var data = paragraph.results.msg[0].data
        if (data && data.length > 0) {
          if (paragraph.errorMessage && paragraph.errorMessage.length > 0) {
            errorMessage = paragraph.errorMessage
          } else {
            errorMessage = paragraph.results.msg[0].data
          }
          detailedErrorMessage = paragraph.results.msg[0].data
        }
      }
      return <div>
        { paragraphHeader }
        <MessageBar messageBarType={ MessageBarType.severeWarning }>
          <div style = {{maxHeight: "350px", overflowY: "auto" }}>
            <pre>
              {errorMessage}
            </pre>
          </div>
          {
            (!this.state.showErrorDetail) && 
            <div>
              <a href="#" onClick={ (e) => { e.preventDefault(); this.setState({showErrorDetail: true}) }}>Show Details</a>
            </div>
          }
          {
            (this.state.showErrorDetail) && 
            <div className="ms-slideDownIn20">
              <div>
                <a href="#" onClick={ (e) => { e.preventDefault(); this.setState({showErrorDetail: false}) }}>Hide Details</a>
              </div>
              <div style = {{maxHeight: "450px", width: "100%", overflowY: "auto" }}>
                <pre>
                {detailedErrorMessage}
                </pre>
              </div>
            </div>
          }
        </MessageBar>
        <div>
          <CommandButton iconProps={ { iconName: 'Sync' } } onClick={ (e => this.restartInterpreters(e))} >Restart Interpreters</CommandButton>
        </div>
        <div>
          <CommandButton iconProps={ { iconName: 'BackToWindow' } } onClick={ (e => this.bindNoteToAllInterpreters(e))} >Bind Interpreters</CommandButton>
        </div>
        { this.getFooter(paragraph) }
      </div>
    }
    var results = paragraph.results
    if (!results) {
      if (paragraph.status == ParagraphStatus.FINISHED) {
        return <div>
          { paragraphHeader }
          { this.getFooter(paragraph) }
        </div>
      }
      if (paragraph.status == ParagraphStatus.READY) {
        return <div>
          { paragraphHeader }
          { this.getFooter(paragraph) }
        </div>
      }
      else {
        return <div style={{minHeight: 70, paddingLeft: '10px'}}>
          { paragraphHeader }
          <Spinner size={50} />
        </div>
      }
    }
    var msgs = results.msg
    if (!msgs) return <div></div>
    if (msgs.length == 0) return <div></div>

    var r = -1
    var rendered = msgs.map( msg => {
      r++
      return <div key={paragraph.id + '-' + r}>{this.renderMsg(paragraph, results, msg, paragraphHeader, stripDisplay, showGraphBar)}</div>
    })

    rendered.push(
      <div className="ms-fontColor-neutralSecondary" style={{ fontSize: "10px"}} key={paragraph.id + '-took'}>
        { this.getFooter(paragraph) }
      </div>
    )

    return rendered
  
  }

  private renderMsg(paragraph, results, msg, paragraphHeader, stripDisplay, showGraphBar) {
    if (!msg) return <div></div>
    const id = paragraph.id
    const data = msg.data
    const type = msg.type
    if ((typeof results) == "string") {
      return (
        <div>
          {paragraphHeader}
          <MessageBar messageBarType={ MessageBarType.severeWarning }>
            <span>{results}</span>
          </MessageBar>
        </div>
      )
    }
    if (!results.msg) return <div></div>
    return (
      <div className="ms-Grid">
        <div className="ms-Grid-row">
          {paragraphHeader}
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ paddingLeft: '10px', margin: '0px' }} key={paragraph.id}>
            {
              ((type == 'TEXT') && (stripDisplay)) && 
              <div style = {{maxHeight: "350px", overflowY: "auto" }}>
                <TextDisplay
                  data={data}
                  stripDisplay={stripDisplay}
                  key={paragraph.dateUpdated}
                  />
              </div>
            }
            {
              ((type == 'TEXT') && (!stripDisplay)) && 
              <TextDisplay
                data={data}
                stripDisplay={stripDisplay}
                key={paragraph.dateUpdated}
                />
            }
{/*
            {
              ((type == 'HTML') && (stripDisplay)) && 
              <div style = {{maxHeight: "500px", overflowY: "auto"}}>
                <HtmlDisplay
                  data={data} 
                  stripDisplay={stripDisplay}
                />
              </div>
            }
            {
              ((type == 'HTML') && (!stripDisplay)) && 
              <HtmlDisplay
                  data={data} 
                  stripDisplay={stripDisplay}
                />
            }
*/}
            {
              (type == 'HTML') && 
              <HtmlDisplay
                data={data} 
                stripDisplay={stripDisplay}
              />
            }
            {
              (type == 'IMG') &&
              <ImageDisplay
                data={data} 
                stripDisplay={stripDisplay}
              />
            }
            {
              (type == 'TABLE') &&
              <TableDisplay
                data={data} 
                id={id} 
                p={paragraph} 
                showGraphBar={showGraphBar}
                stripDisplay={stripDisplay}
              />
            }
            {
              (type == 'MATHJAX') &&
              <MathjaxDisplay
                data={data}
                stripDisplay={stripDisplay}
              />
            }
            {
              (type == 'REACTJS') &&
              <ReactjsDisplay
                data={data}
                stripDisplay={stripDisplay}
              />
            }
          </div>
        </div>
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { isStartParagraphRun, webSocketMessageSent, webSocketMessageReceived } = nextProps
/*
    if (isStartParagraphRun) {
      if (isStartParagraphRun.paragraphId == this.state.paragraph.id) {
        if (!isParagraphRunning(this.state.paragraph)) {
          var p = this.state.paragraph
          p.status = ParagraphStatus.PENDING
          p.results = null
          this.state.paragraph = p
          this.setState({
            paragraph: p
          })
        }
      }
    }
*/
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH")) {
      var paragraph = webSocketMessageReceived.data.paragraph
      if (paragraph.id == this.state.paragraph.id) {
        this.setState({
          paragraph: paragraph
        })
      }
    }
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH_UPDATE_OUTPUT")) {
      var paraOutput = webSocketMessageReceived.data
      if ((paraOutput.noteId == this.state.note.id) && (paraOutput.paragraphId === this.state.paragraph.id)) {
        var p = this.state.paragraph
        if (!p.results) {
          p.results = {
            msg: []
          }
        }
        if (!p.results.msg[paraOutput.index]) {
          for (var i = p.results.msg.length; i<=paraOutput.index; i++) {
            p.results.msg.push({
              data: '',
              type: 'TEXT'
            })
          }
        }
        p.results.msg[paraOutput.index].data = paraOutput.data
        this.setState({
          paragraph: p
        })
      }
    }
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH_APPEND_OUTPUT")) {
      var paraOutput = webSocketMessageReceived.data
      if ((paraOutput.noteId == this.state.note.id) && (paraOutput.paragraphId === this.state.paragraph.id)) {
        var p = this.state.paragraph
        if (!p.results) {
          p.results = {
            msg: []
          }
        }
        if (!p.results.msg[paraOutput.index]) {
          for (var i = p.results.msg.length; i<=paraOutput.index; i++) {
            p.results.msg.push({
              data: '',
              type: 'TEXT'
            })
          }
        }
        p.results.msg[paraOutput.index].data = p.results.msg[paraOutput.index].data + paraOutput.data
        this.setState({
          paragraph: p
        })
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
        toastr.warn('Interpreters', 'All interpreters are already binded to current note - Try to restart interpreters.')
      }
    }
  }

  public showStartRun() {
    var p = this.state.paragraph
    p.status = ParagraphStatus.PENDING
    p.results = null
    this.setState({
      paragraph: p
    })
  }

  @autobind
  private updateTitle(message) {
    this.state.paragraph.title = message.title
    this.notebookApi.commitParagraph(this.state.paragraph)
  }

  private async restartInterpreters(e) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.restartInterpreters()
  }

  private async bindNoteToAllInterpreters(e) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.getInterpreterBindings(this.state.note.id)
  }

  private getFooter(paragraph: any) {
    if (isParagraphRunning(paragraph)) {
      return getElapsedTime(paragraph)
    } else {
      return getExecutionMessage(paragraph)
    }
  }

}
