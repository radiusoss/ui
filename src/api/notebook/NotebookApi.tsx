import * as React from 'react'
import history from './../../history/History'
import { toastr } from 'react-redux-toastr'
import { toastrSuccessOptions } from './../../util/Utils'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import SpitfireApi, { ISpitfireApi, SpitfireResponse } from './../spitfire/SpitfireApi'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from './../../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import GoogleApi from './../google/GoogleApi'
import { GoogleProfileStorageKey } from './../google/GoogleApi'
import MicrosoftApi from './../microsoft/MicrosoftApi'
import { MicrosoftProfileStorageKey } from './../microsoft/MicrosoftApi'
import TwitterApi from './../twitter/TwitterApi'
import { TwitterProfileStorageKey } from './../twitter/TwitterApi'

export const MeStorageKey = 'me'

export interface INotebookApi extends ISpitfireApi {}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class NotebookApi extends React.Component<any, any> implements INotebookApi {
  private spitfireApi: SpitfireApi
  private googleApi: GoogleApi
  private microsoftApi: MicrosoftApi
  private twitterApi: TwitterApi

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

  public showNoteLayout(id: string, layout: string) {
    history.push(`/dla/explorer/note/${layout}/${id}`)
    return this.spitfireApi.getNote(id)
  }

  public showNoteScratchpad(id) {
    history.push(`/dla/explorer/scratchpad`)
  }

  public getNote(id: string) {
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
    
  public runAllParagraphs(id: string, paragraphs: any[]) {
    return this.spitfireApi.runAllParagraphs(id, paragraphs)
  }

  public runAllParagraphsSpitfire(id: string, paragraphs: any[]) {
    return this.spitfireApi.runAllParagraphsSpitfire(id, paragraphs)
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
        var result = this.restartInterpreter(id).then(result => {
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
    const { goTo, dispatch, location, isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated } = this.props
    if (goTo) {
      history.push(goTo)
    }
  }

// ----------------------------------------------------------------------------
  
  public updateGoogleProfile(goPath: string) {
    var me: any
    try {
     me = JSON.parse(localStorage.getItem(MeStorageKey))
    }
    catch(e) {
      console.log(e)
    }
    if (me && me.resourceName) {
      this.processGoogleMe(me, goPath)
    }
    else {
      var cred = localStorage.getItem(GoogleProfileStorageKey)
      if (cred) {
        this.googleApi.getMe()
          .then(me => {
            this.processGoogleMe(me.result, goPath)
          })
        }
      }
  }

  private processGoogleMe(me: any, goPath: string) {
    console.log('Google Me', me)
    NotebookStore.state().me = me
    localStorage.setItem(MeStorageKey, JSON.stringify(me))
    var principalName = me.resourceName
    console.log("Google Principal Name", principalName)
    var displayName = me.names[0].displayName
    var userName = principalName
    console.log("Google Display Name", displayName)
    NotebookStore.state().profileDisplayName = displayName
    var email = ""
    if (me.emailAddresses) {
      email = me.emailAddresses[0].value
      userName = email
    }
    console.log("Google Email", email)
    this.login(userName + "#google", principalName)
      .then(res => {
        console.log('Google Notebook Login', res)
        NotebookStore.state().notebookLogin = res
        if (!res.success) {
          history.push("/500")
        }
        else if (res.result.status != "OK") {
          history.push("/500")
        }
        else {
          this.spitfireApi.newRestClient(res.result.body.principal)
          var photoUrl = me.photos[0].url
          console.log("Google Photo Url", photoUrl)
          NotebookStore.state().profilePhoto = photoUrl
          fetch(photoUrl)
            .then((response: any) => {
              return response.blob()
            }).then((photoBlob: any) => {
              NotebookStore.state().profilePhotoBlob = photoBlob
              console.log("Google Photo Blob", photoBlob)
              this.props.dispatchIsGoogleAuthenticatedAction()
              if (this.state.initialPath.startsWith('/auth/')) {
                history.push(goPath)
//              this.props.dispatchGoToAction(goPath)
              }
            })
          }
      })
      .catch(function(error) {
        console.log(error)
      })
  }

// ----------------------------------------------------------------------------
  
  public updateMicrosoftProfile() {
    var profile = localStorage.getItem(MicrosoftProfileStorageKey)
    if (profile) {
      this.microsoftApi.getMe(async (err, me) => {
        if (!err) {
          console.log('Microsoft Me', me)
          NotebookStore.state().me = me
          var principalName = me.userPrincipalName
          console.log("Microsoft Principal Name", principalName)
          var displayName = me.userPrincipalName
          console.log("Microsoft Display Name", displayName)
          NotebookStore.state().profileDisplayName = displayName
          this.login(principalName + "#microsoft", principalName)
            .then(res => {
              console.log('Microsoft Notebook Login', res)
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
    console.log('Twitter Me', me)
    NotebookStore.state().me = me
    localStorage.setItem(MeStorageKey, JSON.stringify(me))
    var principalName = me.screen_name
    console.log("Twitter Principal Name", principalName)
    var displayName = me.name
    console.log("Twitter Display Name", displayName)
    NotebookStore.state().profileDisplayName = displayName
    this.login(principalName + "#twitter", principalName)
      .then(res => {
        console.log('Twitter Notebook Login', res)
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
