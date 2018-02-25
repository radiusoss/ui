import * as React from 'react'
import { NotebookStore } from './../../store/NotebookStore'
import { connect } from 'react-redux'
import history from './../../history/History'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { ParagraphStatus } from '../paragraph/ParagraphUtil'

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
              {
                Array.from(runningParagraphs).map(p => {
                  if (p[1] && (p[1].status == ParagraphStatus.RUNNING)) {
                    return <div className="ms-fontWeight-semibold">{this.getLink(p)}</div>
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
                    return this.getLink(p)
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
                    return this.getLink(p)
                  }
                })
              }
            </div>
          </div>
          {
            (this.state.runningParagraphs.size > 0) &&  <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <hr/>
              <CommandButton iconProps={ { iconName: 'Sync' } } onClick={ (e => this.resetRunningParagraphs(e))} >Clean</CommandButton>
            </div>
          </div>
           }
        </div>
      </div>
    )
  }

  private getLink(p) {
    // onClick={ e => this.loadWorkbench(e, p) }
    if (p[1]) {
      if (p[1].title && p[1].title.length > 0) {
        return <div key={p[1].id}>
          {p[1].title}
        </div>
      } else {
        return <div key={p[1].id}>
          {p[1].id} (no title)
        </div>
      }
    } 
  }

  private loadWorkbench(e, p) {
    e.preventDefault()
    history.push('/dla/explorer/workbench/')
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
