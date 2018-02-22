import * as React from 'react'
import { NotebookStore } from './../../store/NotebookStore'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class JobsStatus extends React.Component<any, any> {
  interval: NodeJS.Timer

  state = {
    runningParagraphs: NotebookStore.state().runningParagraphs
  }

  public constructor(props) {
    super(props)
    console.log('dddddd', this.state.runningParagraphs)
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
                  return <div>{p[0]} [{p[1].title}]</div>
                })
              }
            </div>
          </div>
        </div>
    </div>
    )
  }

  public componentDidMount() {
    this.interval = setInterval( _ => this.tick, 1000)
  }

  private tick() {
    this.setState({
      runningParagraphs: NotebookStore.state().runningParagraphs
    })
  }

  public componentWillReceiveProps(nextProps) {
    const { runningParagraphs } = nextProps
    if (runningParagraphs) {
      this.setState({
        runningParagraphs: runningParagraphs
      })
    }
  }

}
