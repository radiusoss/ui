import * as React from 'react'
import { connect } from 'react-redux'
import history from './../../../../routes/History'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../../actions/NotebookActions'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import HtmlRenderer from './display/HtmlRenderer'
import ReactjsRenderer from './display/ReactjsRenderer'
import { toastr } from 'react-redux-toastr'
import ImageRenderer from './display/ImageRenderer'
import MathjaxRenderer from './display/MathjaxRenderer'
import TableRenderer from './display/TableRenderer'
import TextRenderer from './display/TextRenderer'
import Spinner from './../../../../_widget/Spinner'
import NotebookApi from './../../../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as stylesImport from './../../../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ParagraphRenderer extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private leftItems: any[] = []
  private rightItems: any[] = []

  state = {
    paragraph: {
      id: '',
      status: '',
      results: {
        msg: {
          data: '',
          type: '',
        }
      }
    },
    showCommandBar: true
  }

  public constructor(props) {
    super(props)
    this.state = {
      paragraph: props.paragraph,
      showCommandBar: props.showCommandBar
    }
    this.leftItems = [
    ]
    this.rightItems = [
      {
        key: '...',
        name: '...',
        title: 'Actions',
        items: [
          {
            key: 'run-indicator',
            name: 'Run',
            icon: 'Play',
            title: 'Run the paragraph [SHIFT+Enter]',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
          {
            key: 'love-indicator',
            name: 'Cover',
            icon: 'Heart',
            title: 'Cover',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
          {
            key: 'add-indicator',
            name: 'Add',
            icon: 'Add',
            title: 'Add',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
          {
            key: 'move-up-indicator',
            name: 'Up',
            icon: 'ChevronUp',
            title: 'Move Paragraph Up',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
          {
            key: 'move-down-indicator',
            name: 'Down',
            icon: 'ChevronDown',
            title: 'Move Paragraph Down',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          },
          {
            key: 'clean',
            icon: 'ClearFormatting',
            name: 'Clear',
            title: 'Clear Content',
            onClick: () => toastr.warning('Not yet available', 'Looks like you are eager for the next release...')
          }
        ]
      }
    ]
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { paragraph, showCommandBar } = this.state
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
    return (
      <div>
{/*
      <div className="ms-Grid">
        <div className="ms-Grid-row">
*/}
          <div className={`ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8`} style={{ paddingLeft: '0px', margin: '0px' }}>
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
              <TableRenderer data={data} id={id} p={paragraph} showCommandBar={showCommandBar} />
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
          <div className={`ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4`} style={{ paddingLeft: '0px', margin: '0px', overflow: 'hidden' }} >
            {
              (showCommandBar == true) && 
              <div className='ms-textAlignRight'>
                <div className="ms-Grid-row">
                  <CommandBar
                    isSearchBoxVisible={ false }
                    items={ this.leftItems }
                    farItems={ this.rightItems }
                    className={ styles.commandBarBackgroundTransparent }
                  />
                </div>
              </div>
            }
          </div>
{/*
        </div>
      </div>
*/}
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
/*
    if (webSocketMessageSent && (webSocketMessageSent.op == "RUN_PARAGRAPH")) {
      var p = this.state.paragraph
      p.results = null
      this.setState({
        paragraph: p
      })
    }
*/
    if (webSocketMessageReceived && (webSocketMessageReceived.op == "PARAGRAPH")) {
      var paragraph = webSocketMessageReceived.data.paragraph
      if (paragraph.id == this.state.paragraph.id) {
        this.setState({
          paragraph: webSocketMessageReceived.data.paragraph
        })
      }
    }
  }

}
