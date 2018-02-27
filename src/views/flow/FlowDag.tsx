import * as React from 'react'
import GraphView from 'react-digraph'
import FlowShapes from './../../util/flows/FlowShapes'
import {
  NODE_ID, EMPTY_TYPE, STANDARD_TYPE, STANDARD_CHILD_SUBTYPE, 
  EMPTY_EDGE_TYPE, STANDARD_EDGE_TYPE }
from './../../util/flows/FlowShapes'
import NotebookApi from './../../api/notebook/NotebookApi'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { TagPicker } from 'office-ui-fabric-react/lib/components/pickers/TagPicker/TagPicker'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class FlowDag extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private graphView: GraphView

  public constructor(props) {
    super(props)
    this.state = {
      notes: [],
      flow: {},
      dag: {
        "nodes": [],
        "edges": []
      },
      selected: {}
    }
    this.getViewNode = this.getViewNode.bind(this)
    this.onSelectNode = this.onSelectNode.bind(this)
    this.onCreateNode = this.onCreateNode.bind(this)
    this.onUpdateNode = this.onUpdateNode.bind(this)
    this.onDeleteNode = this.onDeleteNode.bind(this)
    this.onSelectEdge = this.onSelectEdge.bind(this)
    this.onCreateEdge = this.onCreateEdge.bind(this)
    this.onSwapEdge = this.onSwapEdge.bind(this)
    this.onDeleteEdge = this.onDeleteEdge.bind(this)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    return (
      <div>
        <TagPicker
          onResolveSuggestions = { this.onFilterChanged.bind(this) }
          getTextFromItem = {(item: any) => { return item.name } }
          onRenderItem = { item => { return <div></div> } }
          onChange={ this.onSelectionChanged.bind(this) }
          pickerSuggestionsProps = {
            {
              suggestionsHeaderText: 'Suggested Note',
              noResultsFoundText: 'No Note Found'
            }
          }
          inputProps = {
            {
              placeholder: ""
            }
          }
        />
        <div id='flowDag' className={styles.flowDag}>
          <GraphView 
            ref = { ref => this.graphView = ref }
            nodeKey = {NODE_ID}
            emptyType = {EMPTY_TYPE}
            nodes = {this.state.dag.nodes}
            edges = {this.state.dag.edges}
            selected = {this.state.selected}
            nodeTypes = {FlowShapes.NodeTypes}
            nodeSubtypes = {FlowShapes.NodeSubtypes}
            edgeTypes = {FlowShapes.EdgeTypes}
            getViewNode = {this.getViewNode}
            onSelectNode = {this.onSelectNode}
            onCreateNode = {this.onCreateNode}
            onUpdateNode = {this.onUpdateNode}
            onDeleteNode = {this.onDeleteNode}
            onSelectEdge = {this.onSelectEdge}
            onCreateEdge = {this.onCreateEdge}
            onSwapEdge = {this.onSwapEdge}
            onDeleteEdge = {this.onDeleteEdge}
          />
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.notebookApi.listFlows()
    this.notebookApi.listNotes()
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "NOTES_INFO") {
      var notes = webSocketMessageReceived.data.notes.map(note => ({ id: note.id, name: note.name }))
      this.setState({notes: notes})
    }
    if (webSocketMessageReceived.op == "SAVE_FLOWS") {
      console.log('flows', webSocketMessageReceived.data.flows)
      var flowId = this.props.match.params.flowId
      webSocketMessageReceived.data.flows.map(flow => {
        if (flow['id'] === flowId) {
          this.setState({
            flow: flow,
            dag: flow.dag
          })
        }
      })
    }
  }

  // Called by 'drag' handler, etc... to sync updates from D3 with the dag.
  private onUpdateNode(node) {
    const dag = this.state.dag
    const i = this.getNodeIndex(node)
    dag.nodes[i] = node
    this.persistDag(dag)
  }

  // Node 'mouseUp' handler.
  private onSelectNode(node) {
    // Deselect events will send Null viewNode
    if (!!node){
      this.setState({
        selected: node
      })
    } 
    else{
      this.setState({
        selected: {}
      })
    }
  }

  // Edge 'mouseUp' handler.
  private onSelectEdge(edge) {
    this.setState({selected: edge})
  }

  // Updates the dag with a new node.
  private onCreateNode(x, y, noteId: string, noteName: string) {
    const dag = this.state.dag
//    const type = Math.random() < 0.25 ? STANDARD_TYPE : EMPTY_TYPE
    const type = EMPTY_TYPE
    const node = {
      id: this.state.dag.nodes.length + 1,
      type: type,
      title: noteName,
      x: x,
      y: y,
      noteId: noteId,
      noteName: noteName
    }
    dag.nodes.push(node)
    this.persistDag(dag)
  }

  // Deletes a node from the dag
  private onDeleteNode(node) {
    const dag = this.state.dag
    const i = this.getNodeIndex(node)
    dag.nodes.splice(i, 1);
    // Delete any connected edges.
    const edges = dag.edges.filter((edge, i) => {
      return  edge.source != node[NODE_ID] && 
              edge.target != node[NODE_ID]
    })
    dag.edges = edges
    this.setState({
      selected: {}
    })
    this.persistDag(dag)
  }

  // Creates a new node between two edges.
  private onCreateEdge(sourceNode, targetNode) {
    const dag = this.state.dag
    const type = sourceNode.type === STANDARD_TYPE ? STANDARD_EDGE_TYPE : EMPTY_EDGE_TYPE
    const viewEdge = {
      source: sourceNode[NODE_ID],
      target: targetNode[NODE_ID],
      type: type
    }
    dag.edges.push(viewEdge)
    this.persistDag(dag)
  }

  // Called when an edge is reattached to a different target.
  private onSwapEdge(sourceNode, targetNode, edge) {
    const dag = this.state.dag;
    const i = this.getEdgeIndex(edge)
    const swappedEdge = JSON.parse(JSON.stringify(dag.edges[i]))
    swappedEdge.source = sourceNode[NODE_ID]
    swappedEdge.target = targetNode[NODE_ID]
    dag.edges[i] = swappedEdge
    this.persistDag(dag)
  }

  private onDeleteEdge(edge){
    const i = this.getEdgeIndex(edge)
    const dag = this.state.dag;
    dag.edges.splice(i, 1)
    this.setState({
      selected: {}
    })
    this.persistDag(dag)
  }

  private getNodeIndex(searchNode) {
    return this.state.dag.nodes.findIndex((node) => {
      return node[NODE_ID] === searchNode[NODE_ID]
    })
  }

  private getEdgeIndex(searchEdge) {
    return this.state.dag.edges.findIndex((edge) => {
      return edge.source === searchEdge.source &&
        edge.target === searchEdge.target
    })
  }

  private getViewNode(nodeKey) {
    const searchNode = {}
    searchNode[NODE_ID] = nodeKey
    const i = this.getNodeIndex(searchNode)
    return this.state.dag.nodes[i]
  }

  private onFilterChanged(filterText: string, notes: { id: string, name: string }[]) {
    return filterText ? this.state.notes.filter(note => note.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1).filter(note => !this.listContainsDocument(note, notes)) : []
  }

  private listContainsDocument(note: { id: string, name: string }, notes: { id: string, name: string }[]) {
    if (!notes || !notes.length || notes.length === 0) {
      return false
    }
//    return notes.filter(compareNote => compareNote.id === note.id).length > 0
    return false
  }

  private onSelectionChanged(notes: [any]) {
    var note = notes[notes.length - 1]
    this.onCreateNode(Math.random() * 200, Math.random() * 200, note.id, note.name)
  }
  
  private persistDag(dag: any) {
    this.setState({dag: dag})
    var flow = this.state.flow
    flow['dag'] = this.state.dag
    this.setState({flow: flow})
    this.notebookApi.saveFlow(flow)
  }

}
