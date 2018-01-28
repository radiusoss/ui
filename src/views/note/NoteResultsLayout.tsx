import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import NotebookApi from './../../api/notebook/NotebookApi'
import NoteEditor from './editor/NoteEditor'
import NoteRenderer from './renderer/NoteRenderer'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteResultsLayout extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    note: {
      id: '',
      name: '',
      paragraphs: []
    },
    showPanel: true
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window['NotebookApi']
  }

  public render() {
    const { note, showPanel } = this.state
    return (
      <div>
      {(showPanel == true) ?
        <Panel
          isOpen={ this.state.showPanel }
          type={ PanelType.smallFluid }
          onDismiss={ () => this.notebookApi.showNoteLayout(this.state.note.id, 'columns') }
          headerText={note.name + ' - ' + new Date()}
        >
          <div className="ms-Grid">
            <div className="ms-Grid-row">
              <div className={`${styles.rendererHeight} ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px', overflowY: 'scroll' }} >
                <NoteRenderer note={note} />
              </div>
            </div>
          </div>
        </Panel>
       :
       <div className="ms-Grid">
         <div className="ms-Grid-row">
           <div className={`${styles.rendererHeight} ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px', overflowY: 'scroll' }} >
             <NoteRenderer note={note} />
           </div>
         </div>
       </div>
      }
      </div>
    )
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

}
