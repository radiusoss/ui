import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../../actions/NotebookActions'
import HtmlRenderer from './display/HtmlRenderer'
import ReactjsRenderer from './display/ReactjsRenderer'
import ImageRenderer from './display/ImageRenderer'
import MathjaxRenderer from './display/MathjaxRenderer'
import TableRenderer from './display/TableRenderer'
import TextRenderer from './display/TextRenderer'
import Spinner from './../../../../_widget/Spinner'
import NotebookApi from './../../../../api/notebook/NotebookApi'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ParagraphRenderer extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { paragraph, showCommandBar } = this.props
    var results = paragraph.results
    if (!results) {
      if (paragraph.status == 'FINISHED') {
        return <div></div>
      }
      else {
        return <div><Spinner size={50} /></div>
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
    )
  }

  public shouldComponentUpdate(nextProps, nextState) {
    const { webSocketMessageSent } = nextProps
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

}
