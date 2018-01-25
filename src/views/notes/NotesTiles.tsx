import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { DefaultButton, PrimaryButton, CompoundButton } from 'office-ui-fabric-react/lib/Button'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import { connect } from 'react-redux'
import NotebookApi from './../../api/notebook/NotebookApi'
import Html from './../_widget/Html'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { WidthProvider, Responsive } from "react-grid-layout";
import * as _ from "lodash";
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

import Grid00Showcase from '../spl/Grid00Showcase'
import Grid01Basic from '../spl/Grid01Basic'
import Grid02NoDragging from '../spl/Grid02NoDragging'
import Grid03Messy from '../spl/Grid03Messy'
import Grid04GridProperty from '../spl/Grid04GridProperty'
import Grid05StaticElements from '../spl/Grid05StaticElements'
import Grid06DynamicAddRemove from '../spl/Grid06DynamicAddRemove'
import Grid07Localstorage from '../spl/Grid07Localstorage'
import Grid08LocalstorageResponsive from '../spl/Grid08LocalstorageResponsive'
import Grid09MinMaxHandle from '../spl/Grid09MinMaxHandle'
import Grid10DynamicMinMaxHandle from '../spl/Grid10DynamicMinMaxHandle'
import Grid11NoVerticalCompact from '../spl/Grid11NoVerticalCompact'
import Grid12PreventCollision from '../spl/Grid12PreventCollision'
import Grid13ResponsiveBootstrapStyle from '../spl/Grid13ResponsiveBootstrapStyle'
import Grid14ErrorCase from '../spl/Grid14ErrorCase'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NotesTiles extends React.Component<any, any> {
  static defaultProps = {
    className: "layout",
    rowHeight: 100
  }
  private readonly notebookApi: NotebookApi

  constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.state = {
      notes: [],
      notesMap: {},
      layout: []
    }
  }

  public render() {    
    let { notes } = this.state
    return (
      <div>
{/*
        <Grid00Showcase/>
        <Grid01Basic/>
        <Grid02NoDragging/>
        <Grid03Messy/>
        <Grid04GridProperty/>
        <Grid05StaticElements/>
        <Grid06DynamicAddRemove/>
        <Grid07Localstorage/>
        <Grid08LocalstorageResponsive/>
        <Grid09MinMaxHandle/>
        <Grid10DynamicMinMaxHandle/>
        <Grid11NoVerticalCompact/>
        <Grid12PreventCollision/>
        <Grid13ResponsiveBootstrapStyle/>
*/}
        <ResponsiveReactGridLayout
          onLayoutChange={this.onLayoutChange}
//          compactType='vertical'
          {...this.props}
        >
          {_.map(this.state.layout, el => this.createTile(el))}
        </ResponsiveReactGridLayout>
      </div>
    )
  }

  public componentDidMount() {
    this.notebookApi.listNotes()
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "NOTES_INFO") {
      var notes = webSocketMessageReceived.data.notes.filter(n => n.name != '_conf')
      var notesMap = {}
      notes.forEach(function (note, key, notes) {
        notesMap[note.id] = note
      })
      var layoutMap = webSocketMessageReceived.data.layout
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
    this.notebookApi.getNote(noteId)
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
    var msg = p.results.msg[0].data
    return (
      <div key={el.i} data-grid={el}>
        <div className='ms-font-xxl'>{note.name}</div>
        <div>{p.title}</div>
        <div><Html data={msg}/></div>
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
    console.log('Layout', layout)
    var layoutMap = {}
    layout.map((l) => {
      layoutMap[l.i] = l
    })
    console.log('Layout Map', layoutMap)
    this.notebookApi.saveLayout(layoutMap)
    this.setState({ layout: layout })
  }

  @autobind
  private onRemoveItem(i) {
    console.log("Removing", i);
    this.setState({ layout: _.reject(this.state.layout, { i: i }) })
  }

}
