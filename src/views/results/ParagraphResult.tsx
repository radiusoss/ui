import * as React from 'react'
import { connect } from 'react-redux'
import history from './../../routes/History'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import HtmlRenderer from './../renderer/HtmlRenderer'
import ReactjsRenderer from './../renderer/ReactjsRenderer'
import { toastr } from 'react-redux-toastr'
import InlineEditor from './../editor/InlineEditor'
import ImageRenderer from './../renderer/ImageRenderer'
import MathjaxRenderer from './../renderer/MathjaxRenderer'
import TableRenderer from './../renderer/TableRenderer'
import TextRenderer from './../renderer/TextRenderer'
import Spinner from './../../_widget/Spinner'
import NotebookApi from './../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ParagraphResult extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private leftItems: any[] = []
  private rightItems: any[] = []

  state = {
    paragraph: {
      id: '',
      title: '',
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
    showGraphBar: false
  }

  public constructor(props) {
    super(props)
    this.state = {
      paragraph: props.paragraph,
      showControlBar: props.showControlBar,
      showParagraphTitle: props.showParagraphTitle,
      showGraphBar: props.showGraphBar
    }
    this.leftItems = [
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
          {
            key: 'to-cover',
            name: 'Cover',
            icon: 'Heart',
            title: 'Cover',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
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
    this.rightItems = [
    ]
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { paragraph, showControlBar, showGraphBar, showParagraphTitle } = this.state
    var results = paragraph.results
    if (!results) {
      if (paragraph.status == 'FINISHED') {
        return <div></div>
      }
      else {
        return <div style={{minHeight: 70}}><Spinner size={50} /></div>
      }
    }
    if ((typeof results) == "string") {
      return (
        <div>
          <MessageBar messageBarType={ MessageBarType.error }>
            <span>{results}</span>
          </MessageBar>
        </div>
      )
    }
    if (!results.msg) return <div></div>
    const id = paragraph.id
    var msg = results.msg[0]
    if (!msg) return <div></div>
    const data = msg.data
    const type = msg.type
    var title = 'Define a nice title...'
    var cl = "ms-font-xl ms-fontWeight-light"
    if (paragraph.title && (paragraph.title.length > 0)) {
      title = paragraph.title
      cl = "ms-font-xl ms-fontWeight-semibold"
    }
    return (
      <div>
        {
        (showControlBar == true) && 
        <div className={`ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px', overflow: 'hidden' }}>
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
        {
        (showParagraphTitle == true) && 
        <div className={`ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px', overflow: 'hidden' }}>
          <div className={cl}>
            <InlineEditor
              text={title}
              paramName="title"
              change={this.updateTitle}
              minLength={0}
              maxLength={33}
              activeClassName="ms-font-xl"
            />
          </div>
        </div>
        }
        <div className={`ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px' }} key={paragraph.id}>
          {
            (type == 'TEXT') &&
            <TextRenderer data={data} />
          }
          {
            (type == 'HTML') &&
            <HtmlRenderer data={data} />
          }
          {
            (type == 'IMG') &&
            <ImageRenderer data={data} />
          }
          {
            (type == 'TABLE') &&
            <TableRenderer data={data} id={id} p={paragraph} showGraphBar={showGraphBar} />
          }
          {
            (type == 'MATHJAX') &&
            <MathjaxRenderer data={data} />
          }
          {
            (type == 'REACTJS') &&
            <ReactjsRenderer data={data} />
          }
        </div>
      </div>
    )
  }

  public shouldComponentUpdate(nextProps, nextState) {
    const { webSocketMessageSent, webSocketMessageReceived, isStartRun } = nextProps
    if (isStartRun) {
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

  public componentWillReceiveProps(nextProps) {
    const { isStartRun, webSocketMessageReceived, webSocketMessageSent } = nextProps
    if (isStartRun) {
      if (isStartRun.paragraphId == this.state.paragraph.id) {
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
          paragraph: webSocketMessageReceived.data.paragraph
        })
      }
    }
  }

  @autobind
  private updateTitle(message) {
    this.state.paragraph.title = message.title
    this.notebookApi.commitParagraph(this.state.paragraph)
  }

}
