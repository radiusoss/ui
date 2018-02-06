import * as React from 'react'
import history from './../../routes/History'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { ISpitfireApi, SpitfireResponse } from './../spitfire/SpitfireApi'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from './../../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { MicrosoftProfileStorageKey } from './../microsoft/MicrosoftApi'
import GoogleApi from './../google/GoogleApi'
import MicrosoftApi from './../microsoft/MicrosoftApi'
import TwitterApi from './../twitter/TwitterApi'
import { TwitterProfileStorageKey } from './../twitter/TwitterApi'

export const MeStorageKey = 'me'

export interface INotebookApi extends ISpitfireApi {}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class NotebookApi extends React.Component<any, any> implements INotebookApi {
  private spitfireApi: ISpitfireApi
  private googleApi: GoogleApi
  private microsoftApi: MicrosoftApi
  private twitterApi: TwitterApi

  public constructor(props) {
    super(props)
    window['NotebookApi'] = this
  }

  public render() {
    return <div>{ this.props.children }</div>
  }
  
  public componentDidMount() {
    this.spitfireApi = window['SpitfireApi']
    this.googleApi = window['GoogleApi']
    this.microsoftApi = window['MicrosoftApi']
    this.twitterApi = window['TwitterApi']
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

  public showNoteLayout(id: string, layout: string) {
    history.push(`/dla/note/${layout}/${id}`)
    return this.spitfireApi.getNote(id)
  }

  public getNote(id: string) {
//    history.push(`/dla/note/columns/${id}`)
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

  public runParagraph(paragraph: any, code: string) {
    return this.spitfireApi.runParagraph(paragraph, code)
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

  public saveLayout(layout: any): void {
    return this.spitfireApi.saveLayout(layout)
  }

  public listFlows(): void {
    return this.spitfireApi.listFlows()
  }

  public getFlow(id: string): void {
    history.push(`/dla/flow/dag/${id}`)
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

  public commitParagraph(p: any, graph: any): void {
    this.spitfireApi.commitParagraph(p, graph)
  }

// ----------------------------------------------------------------------------
  
  public updateGoogleProfile() {
    // https://content-people.googleapis.com/v1/people/me?access_token=ya29.GltZBb2eUEvcT7Ue7WS4G4GUYGtXInPlQJWYJJzBkDU1CAeBiFbt6R9ZqHxTzWpgTm4Ebc3ENnSS9dFMmaBXe5hoEu1nbksbAgMnK1efs06miQCEssyh6Vmo3TEJ&key=AIzaSyA4GOtTmfHmAL5t8jn0LBZ_SsInQukugAU&personFields=emailAddresses
  }

// ----------------------------------------------------------------------------
  
  public updateMicrosoftProfile() {
    var profile = localStorage.getItem(MicrosoftProfileStorageKey)
    if (profile) {
      this.microsoftApi.getMe(async (err, me) => {
        if (!err) {
          console.log('me', me)
          NotebookStore.state().me = me
          var principalName = me.userPrincipalName
          console.log("Microsoft Principal Name", principalName)
          var displayName = me.userPrincipalName
          console.log("Microsoft Display Name", displayName)
          NotebookStore.state().profileDisplayName = displayName
          this.login(principalName + "#microsoft", principalName)
            .then(res => {
              console.log('Notebook Login', res)
              NotebookStore.state().notebookLogin = res
            })
          this.microsoftApi.getMyPicto((err, photoBlob) => {
            if (!err) {
              NotebookStore.state().profilePhotoBlob = photoBlob
              console.log("Microsoft Photo Blob", photoBlob)
              this.props.dispatchIsMicrosoftAuthenticatedAction()
              history.push("/")
            }
          })
        }
      })
    }
  }

// ----------------------------------------------------------------------------

  public updateTwitterProfile() {
    var me: any
    try {
     me = JSON.parse(localStorage.getItem(MeStorageKey))
    }
    catch(e) {
      console.log(e)
    }
    if (me && me.screen_name) {
      this.processTwitterMe(me)
    }
    else {
      var cred = localStorage.getItem(TwitterProfileStorageKey)
      if (cred) {
        this.twitterApi.getMe()
          .then(me => {
            this.processTwitterMe(me.result)
          })
        }
      }
  }

  private processTwitterMe(me: any) {
    console.log('me', me)
    NotebookStore.state().me = me
    localStorage.setItem(MeStorageKey, JSON.stringify(me))
    var principalName = me.screen_name
    console.log("Twitter Principal Name", principalName)
    var displayName = me.name
    console.log("Twitter Display Name", displayName)
    NotebookStore.state().profileDisplayName = displayName
    this.login(principalName + "#twitter", principalName)
      .then(res => {
        console.log('Notebook Login', res)
        NotebookStore.state().notebookLogin = res
      })
      var photoUrl = me.profile_image_url_https
      console.log("Twitter Photo Url", photoUrl)
      NotebookStore.state().profilePhoto = photoUrl
      fetch(photoUrl)
        .then((response: any) => {
          return response.blob()
        }).then((photoBlob: any) => {
          NotebookStore.state().profilePhotoBlob = photoBlob
          console.log("Twitter Photo Blob", photoBlob)
          this.props.dispatchIsTwitterAuthenticatedAction()
          history.push("/")
        })
  }

}
