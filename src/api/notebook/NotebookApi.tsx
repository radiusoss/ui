import * as React from 'react'
import history from './../../history/History'
import { toastr } from 'react-redux-toastr'
import { toastrSuccessOptions } from './../../util/Utils'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import SpitfireApi, { ISpitfireApi, SpitfireResponse } from './../spitfire/SpitfireApi'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from './../../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'

export const MeStorageKey = 'me'

export interface INotebookApi extends ISpitfireApi {}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class NotebookApi extends React.Component<any, any> implements INotebookApi {
  private spitfireApi: SpitfireApi

  state = {
    initialPath: ''
  }

  public constructor(props) {
    super(props)
    this.state = {
      initialPath: window.location.hash.replace(/\/$/, '').replace('#', '')
    }
    window['NotebookApi'] = this
  }

  public render() {
    return <div>{ this.props.children }</div>
  }
  
  public componentDidMount() {
    this.spitfireApi = window['SpitfireApi']
  }

// ----------------------------------------------------------------------------

  public async ping() {
    return this.spitfireApi.ping()
  }

  public async login(userName, password) {
    return this.spitfireApi.login(userName, password)    
  }

  public async ticket() {
    return this.spitfireApi.ticket()
  }

  public async version() {
    return this.spitfireApi.version()
  }

  public async interpreterSetting() {
    return this.spitfireApi.interpreterSetting()
  }

  public async configuration() {
    return this.spitfireApi.configuration()
  }

  public async getNotePermissions(noteId: string) {
    return this.spitfireApi.getNotePermissions(noteId)
  }

  public async putNotePermissions(noteId: string, permissions: any) {
    return this.spitfireApi.putNotePermissions(noteId, permissions)
  }

// ----------------------------------------------------------------------------

  public listNotes() {
    return this.spitfireApi.listNotes()
  }

  public newNote(name: string) {
    return this.spitfireApi.newNote(name)
  }

  public cloneNote(noteId: string, name: string) {
    return this.spitfireApi.cloneNote(noteId, name)
  }

  public importNote(note: any) {
    return this.spitfireApi.importNote(note)
  }

  public showNoteLayout(id: string, layout: string) {
    history.push(`/dla/explorer/note/${layout}/${id}`)
    return this.spitfireApi.getNote(id)
  }

  public getNote(id: string) {
    return this.spitfireApi.getNote(id)
  }

  public checkpointNote(noteId: string, message: string) {
    return this.spitfireApi.checkpointNote(noteId, message)
  }

  public renameNote(id: string, newName: string) {
    return this.spitfireApi.renameNote(id, newName)
  }

  public moveNoteToTrash(id: string) {
    return this.spitfireApi.moveNoteToTrash(id)
  }

  public deleteNote(id: string) {
    return this.spitfireApi.deleteNote(id)
  }

  public runParagraph(paragraph: any, code: string) {
    return this.spitfireApi.runParagraph(paragraph, code)
  }
    
  public runAllParagraphs(id: string, paragraphs: any[]) {
    return this.spitfireApi.runAllParagraphs(id, paragraphs)
  }

  public runAllParagraphsSpitfire(id: string, paragraphs: any[]) {
    return this.spitfireApi.runAllParagraphsSpitfire(id, paragraphs)
  }

  public cancelParagraph(id: string) {
    return this.spitfireApi.cancelParagraph(id)
  }

  public restartInterpreter(id: string, noteId: string) {
    return this.spitfireApi.restartInterpreter(id, noteId)
  }

  public restartInterpreterForAllUsers(id: string) {
    return this.spitfireApi.restartInterpreterForAllUsers(id)
  }

  public listConfigurations(): void {
    return this.spitfireApi.listConfigurations()
  }

  public addUsers(users: any): void {
    return this.spitfireApi.addUsers(users)
  }

  public removeUsers(users: any): void {
    return this.spitfireApi.removeUsers(users)
  }

  public listUsers(): void {
    return this.spitfireApi.listUsers()
  }

  public newFlow(name: string): void {
    return this.spitfireApi.newFlow(name)
  }

  public saveFlow(flow: any): void {
    return this.spitfireApi.saveFlow(flow)
  }

  public saveFlows(flows: any): void {
    return this.spitfireApi.saveFlows(flows)
  }

  public saveLayout(layout: any): void {
    return this.spitfireApi.saveLayout(layout)
  }

  public listFlows(): void {
    return this.spitfireApi.listFlows()
  }

  public getFlow(id: string): void {
    history.push(`/dla/explorer/flow/dag/${id}`)
    this.spitfireApi.getFlow(id)
  }

  public renameFlow(id: string, newName: string): void {
    return this.spitfireApi.renameFlow(id, newName)
  }

  public moveFlowToTrash(id: string): void {
    return this.spitfireApi.moveFlowToTrash(id)
  }

  public deleteFlow(id: string): void {
    return this.spitfireApi.deleteFlow(id)
  }

  public runFlow(id: string): void {
    return this.spitfireApi.runFlow(id)
  }

  public commitParagraph(p: any): void {
    this.spitfireApi.commitParagraph(p)
  }

  public commitParagraphWithGraph(p: any, graph: any): void {
    this.spitfireApi.commitParagraphWithGraph(p, graph)
  }

  public insertParagraph(index: number): void {
    this.spitfireApi.insertParagraph(index)
  }

  public moveParagraph(paragraphId: string, index: number): void {
    this.spitfireApi.moveParagraph(paragraphId, index)
  }

  public removeParagraph(paragraphId: string): void {
    this.spitfireApi.removeParagraph(paragraphId)
  }

  public clearParagraphOutput(paragraphId: string): void {
    this.spitfireApi.clearParagraphOutput(paragraphId)
  }

  public getInterpreterBindings(noteId: string): any {
    return this.spitfireApi.getInterpreterBindings(noteId)
  }

  public saveInterpreterBindings(noteId: string, interpreterIds: [string]) {
    return this.spitfireApi.saveInterpreterBindings(noteId, interpreterIds)
  }

// ----------------------------------------------------------------------------
  
  public restartInterpreters() {
    var interpreterSettings = this.interpreterSetting()
    interpreterSettings.then(res => {
      var interpreters = res.result.body
      for (var i in interpreters) {
        var id = interpreters[i].id
        var name = interpreters[i].name
        console.log('Requesting restart for Interpreter: ' + name + '(id: ' + id + ')')
        var result = this.restartInterpreter(id, NotebookStore.state().scratchpadNoteId).then(result => {
          console.log('Restart Interpreter result', name, result)
          if (result.success == true) {
            toastr.success('Restart', 'Interpreters are restarted.', toastrSuccessOptions)
          } else {
            toastr.error('Restart', 'Interpreters failed to restart.', toastrSuccessOptions)
          }
        })
      }
    })
  }

  public restartInterpretersForAllUsers() {
    var interpreterSettings = this.interpreterSetting()
    interpreterSettings.then(res => {
      var interpreters = res.result.body
      for (var i in interpreters) {
        var id = interpreters[i].id
        var name = interpreters[i].name
        console.log('Requesting restart for Interpreter: ' + name + '(id: ' + id + ')')
        var result = this.restartInterpreterForAllUsers(id).then(result => {
          console.log('Restart Interpreter result', name, result)
          if (result.success == true) {
            toastr.success('Restart', 'Interpreters are restarted.', toastrSuccessOptions)
          } else {
            toastr.error('Restart', 'Interpreters failed to restart.', toastrSuccessOptions)
          }
        })
      }
    })
  }

  // ----------------------------------------------------------------------------
  
  public componentWillReceiveProps(nextProps) {
    const { goTo, dispatch, location, } = this.props
    if (goTo) {
      history.push(goTo)
    }
  }
}
