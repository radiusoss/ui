import * as React from 'react'
import history from './../../routes/History'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { ISpitfireApi, SpitfireResponse } from './../spitfire/SpitfireApi'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from './../../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import AadApi from './../microsoft/AadApi'

export interface INotebookApi extends ISpitfireApi {}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class NotebookApi extends React.Component<any, any> implements INotebookApi {
  private spitfireApi: ISpitfireApi
  private aadApi: AadApi

  public constructor(props) {
    super(props)
    window['notebookApi'] = this
  }
  public render() {
    return <div>{ this.props.children }</div>
  }
  public componentDidMount() {
    this.spitfireApi = window['spitfireApi']
    this.aadApi = window['aadApi']
    this.updateProfile()
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

// ----------------------------------------------------------------------------

  public listNotes() {
    return this.spitfireApi.listNotes()
  }
  public newNote(name: string) {
    return this.spitfireApi.newNote(name)
  }
  public getNote(id: string) {
    history.push(`/dla/note/${id}`)
    return this.spitfireApi.getNote(id)
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
  public runNote(id: string, paragraphs: any[]) {
//    toastr.info('Run', 'Running note', {timeOut: 500})
    return this.spitfireApi.runNote(id, paragraphs)
  }
  public cancelParagraph(id: string) {
    return this.spitfireApi.cancelParagraph(id)
  }
  public restartInterpreter(id: string) {
    return this.spitfireApi.restartInterpreter(id)
  }
  public listConfigurations(): void {
    return this.spitfireApi.listConfigurations()
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
  public listFlows(): void {
    return this.spitfireApi.listFlows()
  }
  public getFlow(id: string): void {
    return this.spitfireApi.getFlow(id)
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

// ----------------------------------------------------------------------------

private updateProfile() {
    var parsedAuth = localStorage.getItem("aad_access_token")
    if (parsedAuth) {
      this.aadApi.getMe(async (err, me) => {
        if (!err) {
          let principalName = me.userPrincipalName
          NotebookStore.state().profileDisplayName = principalName
          console.log("Aad profileDisplayName", principalName)
          this.login(principalName, principalName)
            .then(res => {
              console.log('Notebook Login', res)
              NotebookStore.state().notebookLogin = res
            })
          this.aadApi.getPhoto((err, photoBlob) => {
            if (!err) {
              NotebookStore.state().profilePhotoBlob = photoBlob
              console.log("Aad photoBlob", photoBlob)
              this.props.dispatchIsAadAuthenticatedAction()
            }
          })
        }
      })
    }
  }

}
