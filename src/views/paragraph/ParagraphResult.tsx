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
      dateStarted: '',
      dateFinished: '',
      dateUpdated: '',
      status: '',
      results: {
        msg: {
          data: '',
          type: '',
        }
      }
    },
    showControlBar: false,
    showParagraphTitle: false,
    showGraphBar: false,
    stripDisplay: false,
    percentComplete: 100
  }

  public constructor(props) {
    super(props)
    this.state = {
      paragraph: props.paragraph,
      showControlBar: props.showControlBar,
      showParagraphTitle: props.showParagraphTitle,
      showGraphBar: props.showGraphBar,
      stripDisplay: props.stripDisplay,
      percentComplete: 100
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

    var leftItems: any[] = []
    var rightItems: any[] = []
    leftItems = [
      {
        key: 'run-indicator',
        icon: 'Play',
        title: 'Run the paragraph [SHIFT+Enter]',
        onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
      },
      {
        key: 'add-indicator',
        icon: 'Add',
        title: 'Add a paragraph',
        onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
      },
      {
        key: 'move-up-indicator',
        icon: 'ChevronUp',
        title: 'Move paragraph up',
        onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
      },
      {
        key: 'move-down-indicator',
        icon: 'ChevronDown',
        title: 'Move paragraph down',
        onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
      },
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
            key: 'clean',
            icon: 'ClearFormatting',
            name: 'Clear',
            title: 'Clear Content',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
          {
            key: 'delete',
            name: 'Delete',
            icon: 'Delete',
            title: 'Delete',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          }
        ]
      }
    ]
    rightItems = []

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
        (showControlBar == true) && 
        <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-textAlignRight" style={{ paddingLeft: '0px', margin: '0px', overflow: 'hidden' }}>
          <div style={{marginLeft: '-20px'}}>
            <CommandBar
              isSearchBoxVisible={ false }
              items={ leftItems }
              farItems={ rightItems }
              className={ styles.commandBarBackgroundTransparent }
            />
          </div>
        </div>
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
    var results = paragraph.results
    if (!results) {
      if (paragraph.status == 'FINISHED') {
        return <div>
          {paragraphHeader}
        </div>
      }
      if (paragraph.status == 'READY') {
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
    var msg = results.msg[0]
    if (!msg) return <div></div>
    const id = paragraph.id
    const data = msg.data
    const type = msg.type
    if ((typeof results) == "string") {
      return (
        <div>
          <MessageBar messageBarType={ MessageBarType.error }>
            {paragraphHeader}
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
              <div style = {{maxHeight: "500px", overflowY: "auto"}}>
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
            <div className="ms-fontColor-neutralTertiary" style={{ fontSize: "10px"}}>
              Took {(new Date(paragraph.dateFinished).getTime() - new Date(paragraph.dateStarted).getTime()) / 1000} sec. Last updated by {paragraph.user} at {new Date(paragraph.dateUpdated).toLocaleString()}.
            </div>
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
      if (isStartNoteRun.paragraphId == this.state.paragraph.id) {
        var p = this.state.paragraph
        p.results = null
        this.setState({
          paragraph: p
        })
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
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH_APPEND_OUTPUT")) {
      var data = webSocketMessageReceived.data.data
      var p = this.state.paragraph
//      console.log('PARAGRAPH_APPEND_OUTPUT', p, data)
    }
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PROGRESS")) {
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

}
