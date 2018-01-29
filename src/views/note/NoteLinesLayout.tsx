import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ParagraphEditor from './editor/paragraph/ParagraphEditor'
import ParagraphResultsRenderer from './renderer/paragraph/ParagraphResultsRenderer'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { goToTop } from 'react-scrollable-anchor'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteLinesLayout extends React.Component<any, any> {

  state = {
    note: {
      id: '',
      paragraphs: []
    }
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { note } = this.state
    var i = 0
    if (note.id) {
      return (
        <div style={{ backgroundColor: "white"}}>
          {
            note.paragraphs.map(p => {
              i++
              return (
                <div>
                  <div className="ms-Grid" key={note.id + '-' + p.id}>
                    <div className="ms-Grid-row">
                      <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px' }}>
                        <ParagraphEditor note={note} paragraph={p} key={note.id + '-pe-' + p.id} focus={i==1}/>
                      </div>
                      <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px', overflow: 'hidden' }} >
                        <ParagraphResultsRenderer paragraph={p} showCommandBar={true} key={note.id + '-pr-' + p.id}/>
                      </div>
                    </div>
                 </div>
              </div>
              )
            })
          }
        </div>
      )
    }
    else {
      return <div></div>
    }
  }

  public componentDidMount() {
//    this.scrollTop()
  }
      
  public componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.scrollTop()
    }
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "NOTE") {
      this.setState({
        note: webSocketMessageReceived.data.note
      })
    }
  }

  private scrollTop() {
    console.log('scrollTop -----------')
    goToTop()
/*
    let renderer = ReactDOM.findDOMNode(this.refs['table-renderer-command-bar'])
    if (renderer) {
      var domNode = ReactDOM.findDOMNode(renderer)
      domNode.scrollIntoView({
        block: "start", 
        behavior: "smooth"
      })
    }
*/
  }

}
