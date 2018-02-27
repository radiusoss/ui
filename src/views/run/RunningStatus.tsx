import * as React from 'react'
import { NotebookStore } from './../../store/NotebookStore'
import { connect } from 'react-redux'
import history from './../../history/History'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { ParagraphStatus, getStatusClassNames } from '../paragraph/ParagraphUtil'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class RunningStatus extends React.Component<any, any> {

  state = {
    runningParagraphs: NotebookStore.state().runningParagraphs
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { runningParagraphs } = this.state
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <hr/>
              <div className="ms-font-l">RUNNING</div>
              {
                Array.from(runningParagraphs).map(p => {
                  if (p[1] && (p[1].status == ParagraphStatus.RUNNING)) {
                    return <div className="ms-fontWeight-semibold">
                      {this.getLink(p[1])}
                    </div>
                  }
                })
              }
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <hr/>
              <div className="ms-font-l">PENDING</div>
              {
                Array.from(runningParagraphs).map(p => {
                  if (p[1] && (p[1].status == ParagraphStatus.PENDING)) {
                    return this.getLink(p[1])
                  }
                })
              }
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <hr/>
              <div className="ms-font-l">ERROR</div>
              {
                Array.from(runningParagraphs).map(p => {
                  if (p[1] && (p[1].status == ParagraphStatus.ERROR)) {
                    return this.getLink(p[1])
                  }
                })
              }
            </div>
          </div>
          {
            (this.state.runningParagraphs.size > 0) &&  <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <hr/>
              <CommandButton 
                iconProps={{
                  iconName: 'ClearFormatting' 
                }} 
                onClick={ (e => this.resetRunningParagraphs(e))} >
                Clear
                </CommandButton>
            </div>
          </div>
           }
        </div>
      </div>
    )
  }

  private getLink(p) {
    // onClick={ e => this.loadWorkbench(e, p) }
    var statusClassNames = getStatusClassNames(p)
    var errorMessage = ''
    if (p.status == ParagraphStatus.ERROR) {
      errorMessage = p.errorMessage
      if (p.results && p.results.msg && p.results.msg.length > 0) {
        errorMessage = p.results.msg[0].data
      }
    }
    var title = ''
    if (p.title && p.title.length > 0) {
      title = p.title
    } else {
      title = p.id + ' (no title)'
    }
    return <div key={p.id} >
      <div className={`ms-fontColor-neutralTertiary ` + statusClassNames}>
        {title}
      </div>
      {
      (errorMessage.length > 0) && <MessageBar messageBarType={ MessageBarType.severeWarning }>
        <div style = {{maxHeight: "350px", overflowY: "auto" }}>
          <pre>
            {errorMessage}
          </pre>
        </div>
      </MessageBar>
      }
    </div>
  }

  private loadWorkbench(e, p) {
    // We miss the note id on the paragraph object - maybe store it in the runninParagraphs Map
    e.preventDefault()
    //history.push('/dla/explorer/workbench/...')
  }

  private resetRunningParagraphs(e) {
    e.stopPropagation()
    e.preventDefault()
    NotebookStore.state().runningParagraphs = new Map<string, any>()
    this.setState({
      runningParagraphs: NotebookStore.state().runningParagraphs
    })
  }

}
