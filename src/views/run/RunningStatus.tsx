import * as React from 'react'
import { NotebookStore } from './../../store/NotebookStore'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

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
                  if (p[1] && p[1].title && p[1].title.length > 0) {
                    return <div key={p[1].id}>{p[1].title} [{p[1].status}]</div>
                  } else {
                    return <div key={p[1].id}>{p[0]} [{p[1].status}]</div>
                  }
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

}
