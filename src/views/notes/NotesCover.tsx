import * as React from 'react'
import * as _ from "lodash"
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { DefaultButton, PrimaryButton, CompoundButton } from 'office-ui-fabric-react/lib/Button'
import history from './../../history/History'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { WidthProvider, Responsive } from "react-grid-layout"
import NotebookApi from './../../api/notebook/NotebookApi'
import ParagraphDisplay from './../paragraph/ParagraphDisplay'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport
/*
import Grid00Showcase from '../spl/grid/Grid00Showcase'
import Grid01Basic from '../spl/grid/Grid01Basic'
import Grid02NoDragging from '../spl/grid/Grid02NoDragging'
import Grid03Messy from '../spl/grid/Grid03Messy'
import Grid04GridProperty from '../spl/grid/Grid04GridProperty'
import Grid05StaticElements from '../spl/grid/Grid05StaticElements'
import Grid06DynamicAddRemove from '../spl/grid/Grid06DynamicAddRemove'
import Grid07Localstorage from '../spl/grid/Grid07Localstorage'
import Grid08LocalstorageResponsive from '../spl/grid/Grid08LocalstorageResponsive'
import Grid09MinMaxHandle from '../spl/grid/Grid09MinMaxHandle'
import Grid10DynamicMinMaxHandle from '../spl/grid/Grid10DynamicMinMaxHandle'
import Grid11NoVerticalCompact from '../spl/grid/Grid11NoVerticalCompact'
import Grid12PreventCollision from '../spl/grid/Grid12PreventCollision'
import Grid13ResponsiveBootstrapStyle from '../spl/grid/Grid13ResponsiveBootstrapStyle'
import Grid14ErrorCase from '../spl/grid/Grid14ErrorCase'
*/
const ResponsiveReactGridLayout = WidthProvider(Responsive)

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NotesCover extends React.Component<any, any> {
/*
  static defaultProps = {
    className: "layout",
    rowHeight: 100
  }
*/
  private readonly notebookApi: NotebookApi

  constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.state = {
      notes: [],
      notesMap: {},
      layout: [],
      showPanel: true
    }
  }

  public render() {
    var { notes, showPanel } = this.state
    return (
      <div>
      {(showPanel == true) ?
        <Panel
          isOpen={ this.state.showPanel }
          type={ PanelType.smallFluid }
//          onDismiss={ () => this.setState({ showPanel: false }) }
          onDismiss={ () => history.push(`/dla/explorer/notes/list`) }
          headerText={'Notebook Cover - ' + new Date()}
        >
          <ResponsiveReactGridLayout
            onLayoutChange={this.onLayoutChange}
  //          compactType='vertical'
            {...this.props}
          >
            {_.map(this.state.layout, el => this.createTile(el))}
          </ResponsiveReactGridLayout>
          <a href='#' onClick={ e => this.hidePanel(e) }>
            <img src='/img/datalayer/datalayer.png' width='100px'/>
          </a>
        </Panel>
       :
        <ResponsiveReactGridLayout
          onLayoutChange={this.onLayoutChange}
//          compactType='vertical'
          {...this.props}
        >
          {_.map(this.state.layout, el => this.createTile(el))}
        </ResponsiveReactGridLayout>
      }
      </div>
    )
  }

  public componentDidMount() {
    this.notebookApi.listNotes()
  }

  public componentWillReceiveProps(nextProps) {
    const { spitfireMessageReceived } = nextProps
    if (! spitfireMessageReceived) return
    if (spitfireMessageReceived.op == "NOTES_INFO") {
      var notes = spitfireMessageReceived.data.notes.filter(n => n.name != '_conf')
      var notesMap = {}
      notes.forEach(function (note, key, notes) {
        notesMap[note.id] = note
      })
      var layoutMap = spitfireMessageReceived.data.layout
      var ii = -1
      var layout = notes.map((note, key, nt) => {
        ii += 1
        var i = note.id
        var ll = layoutMap[i]
        if (ll) {
          return ll
        }
        else {
          return {
            i: i.toString(),
            x: (ii * 2) % 12,
            y: (ii * 12) % 12,
            w: 2,
            h: 2
          }
        }
      })
      this.setState ({
        notes: notes,
        notesMap: notesMap,
        layout: layout
      })
    }
  }

  @autobind
  private loadNote(e: React.MouseEvent<HTMLAnchorElement>, noteId) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.showNoteLayout(noteId, 'workbench')
  }

  @autobind
  private hidePanel(e: React.MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({ showPanel: false })
  }

  @autobind
  private createTile(el) {
    const removeStyle: React.CSSProperties = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    }
    var note = this.state.notesMap[el.i]
    var p = note.p
    return (
      <div key={el.i} data-grid={el}>
        <a className='ms-fontWeight-semibold' href='#' onClick={ e => this.loadNote(e, el.i) }>
          {note.name}
        </a>
        <div>
          {p.title}
        </div>
        <div>
          <ParagraphDisplay 
            note={note}
            paragraph={p} 
            showControlBar={false} 
            showParagraphTitle={true}
            stripDisplay={true}
          />
        </div>
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, el.i)}
        >x</span>
      </div>
    )
  }

  @autobind
  private onLayoutChange(layout) {
//    this.props.onLayoutChange(layout);
    var layoutMap = {}
    layout.map((l) => {
      layoutMap[l.i] = l
    })
    this.notebookApi.saveLayout(layoutMap)
    this.setState({ layout: layout })
  }

  @autobind
  private onRemoveItem(i) {
    this.setState({ layout: _.reject(this.state.layout, { i: i }) })
  }

}
