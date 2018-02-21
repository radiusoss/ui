import * as React from 'react'
import { connect } from 'react-redux'
import history from './../../history/History'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import HtmlDisplay from './../display/HtmlDisplay'
import ReactjsDisplay from './../display/ReactjsDisplay'
import { toastr } from 'react-redux-toastr'
import InlineEditor from './../editor/InlineEditor'
import { ParagraphStatus } from './ParagraphStatus'
import ImageDisplay from './../display/ImageDisplay'
import MathjaxDisplay from './../display/MathjaxDisplay'
import TableDisplay from './../display/TableDisplay'
import TextDisplay from './../display/TextDisplay'
import Spinner from './../../_widget/Spinner'
import NotebookApi from './../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ParagraphResult extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  state = {
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
    percentComplete: 100,
    showErrorDetail: false
  }

  public constructor(props) {
    super(props)
    this.state = {
      paragraph: props.paragraph,
      showControlBar: props.showControlBar,
      showParagraphTitle: props.showParagraphTitle,
      showGraphBar: props.showGraphBar,
      stripDisplay: props.stripDisplay,
      percentComplete: 100,
      showErrorDetail: false
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {

    const { paragraph, showControlBar, showGraphBar, showParagraphTitle, stripDisplay, percentComplete } = this.state

    var paragraphHeader = <div></div>
    var title = '[Add an awesome title]'
    var cl = "ms-font-l ms-fontWeight-light dla-ParagraphTitle"
    if (paragraph.title && (paragraph.title.length > 0)) {
      title = paragraph.title
      cl = "ms-font-xl ms-fontWeight-semibold"
    }

    paragraphHeader = 
      <div>
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
    {
      (this.isParagraphRunning(paragraph)) && 
      <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ padding: 0, margin: 0, overflow: 'hidden' }}>
        <ProgressIndicator
          percentComplete={ percentComplete }
        />
      </div>
    }
    if (paragraph.status == ParagraphStatus.ERROR) {
      var errorMessage = paragraph.errorMessage
      var detailedErrorMessage = "No Detail Available for the Returned Message."
      if (paragraph.results && paragraph.results.msg && paragraph.results.msg.length > 0) {
        var data = paragraph.results.msg[0].data
        if (data && data.length > 0) {
          errorMessage = paragraph.results.msg[0].data
          if (paragraph.errorMessage && paragraph.errorMessage.length > 0) {
            detailedErrorMessage = paragraph.errorMessage
          }
        }
      }
      return <div>
        {paragraphHeader}
        <MessageBar messageBarType={ MessageBarType.severeWarning }>
          <div>{errorMessage}</div>
          {
            !this.state.showErrorDetail && <div>
            <a href="#" onClick={ (e) => { e.preventDefault(); this.setState({showErrorDetail: true}) }}>Show Details</a>
            </div>
          }
          {
            this.state.showErrorDetail && <div className="ms-slideDownIn20">
              <div>
                <a href="#" onClick={ (e) => { e.preventDefault(); this.setState({showErrorDetail: false}) }}>Hide Details</a>
              </div>
              {detailedErrorMessage}
          </div>
          }
          <CommandButton iconProps={ { iconName: 'Sync' } } onClick={ (e => this.restartInterpreters(e))} >Restart Interpreters</CommandButton>
        </MessageBar>
      </div>
    }
    var results = paragraph.results
    if (!results) {
      if (paragraph.status == ParagraphStatus.FINISHED) {
        return <div>
          {paragraphHeader}
        </div>
      }
      if (paragraph.status == ParagraphStatus.READY) {
        return <div>
          {paragraphHeader}
        </div>
      }
      else {
        return <div style={{minHeight: 70, paddingLeft: '10px'}}>
          {paragraphHeader}
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
        Took {(new Date(paragraph.dateFinished).getTime() - new Date(paragraph.dateStarted).getTime()) / 1000} sec. Last updated by {paragraph.user} at {new Date(paragraph.dateUpdated).toLocaleString()}.
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
              <div style = {{maxHeight: "350px", overflowY: "auto"}}>
                <TextDisplay
                  data={data}
                  stripDisplay={stripDisplay}
                />
              </div>
            }
            {
              ((type == 'TEXT') && (!stripDisplay)) && 
              <TextDisplay
                data={data}
                stripDisplay={stripDisplay}
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
/*
  public shouldComponentUpdate(nextProps, nextState) {
    const { webSocketMessageSent, webSocketMessageReceived, isStartNoteRun } = nextProps
    if (isStartNoteRun) {
      return true
    }
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH")) {
      return true
    }
    if (webSocketMessageSent && (webSocketMessageSent.op == "RUN_PARAGRAPH")) {
      return true
    }
    if (webSocketMessageSent && (webSocketMessageSent.op == "RUN_ALL_PARAGRAPHS_SPITFIRE")) {
      return true
    }
    if (!nextProps.paragraph) {
      return false
    }
    if ((!nextProps.paragraph.results)) {
      return false
    }
    return true
  }
*/
  public componentWillReceiveProps(nextProps) {
    const { isStartNoteRun, webSocketMessageSent, webSocketMessageReceived } = nextProps
    if (isStartNoteRun) {
      if (!isStartNoteRun.noteId) {
        if (isStartNoteRun.paragraphId == this.state.paragraph.id) {
          var p = this.state.paragraph
          p.results = null
          this.setState({
            paragraph: p
          })
        }
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
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH_UPDATE_OUTPUT")) {
      var data = webSocketMessageReceived.data.data
      var p = this.state.paragraph
      console.log('PARAGRAPH_UPDATE_OUTPUT', p, data)
    }
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH_APPEND_OUTPUT")) {
      var data = webSocketMessageReceived.data.data
      var p = this.state.paragraph
      console.log('PARAGRAPH_APPEND_OUTPUT', p, data)
    }
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PROGRESS")) {
      var data = webSocketMessageReceived.data.data
      console.log('PROGRESS', p, data)
      var progress = webSocketMessageReceived.data.progress
      if (progress == 0) {
        progress = 100
      }
      this.setState({
        progress: progress
      })
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

  private async restartInterpreters(e) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.restartInterpreters()
  }

}
