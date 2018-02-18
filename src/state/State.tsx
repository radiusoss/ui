import * as redux from 'redux'
import { IConfig, emptyConfig } from '../api/config/ConfigApi'

export namespace ApplicationState {
  export type Counter = { 
    value: number 
  }
  export type State = {
    counter: Counter,
    isSavingCounter: boolean,
    isLoadingCounter: boolean,
    errorCounter: string,
    isToGoogle: boolean,
    isGoogleAuthenticated: boolean,
    googleToken: any,
    isToMicrosoft: boolean,
    isMicrosoftAuthenticated: boolean,
    microsoftToken: any,
    isToTwitter: boolean,
    isTwitterAuthenticated: boolean,
    twitterToken: any,
    notebookLogin: any,
    webSocketMessageSent: any,
    webSocketMessageReceived: any,
    note: any,
    notes: any[],
    runningParagraphs: any[],
    isStartNoteRun: {noteId: any},
    isStartParagraphRun: {noteId: any, paragraphId: any},
    me: any,
    profileDisplayName: string,
    profilePhoto: string,
    profilePhotoBlob: Blob,
    config: IConfig,
    kuberLogin: any,
    kuberMessageSent: any,
    kuberMessageReceived: any,
    clearScratchpad: boolean,
    goTo: string
  }
}

const initialCounter: ApplicationState.Counter = {
  value: 0
}

export const initialState: ApplicationState.State = {
  counter: initialCounter,
  isSavingCounter: false,
  isLoadingCounter: false,
  errorCounter: '',
  isToGoogle: false,
  isGoogleAuthenticated: false,
  googleToken: {},
  isToMicrosoft: false,
  isMicrosoftAuthenticated: false,
  microsoftToken: {},
  isToTwitter: false,
  isTwitterAuthenticated: false,
  twitterToken: {},
  notebookLogin: {},
  webSocketMessageSent: {},
  webSocketMessageReceived: {},
  note: {},
  notes: [],
  runningParagraphs: [],
  isStartNoteRun: null,
  isStartParagraphRun: null,
  me: {},
  profileDisplayName: '',
  profilePhoto: 'img/datalayer/datalayer-square.png',
  profilePhotoBlob: new Blob(),
  config: emptyConfig,
  kuberLogin: {},
  kuberMessageSent: {},
  kuberMessageReceived: {},
  clearScratchpad: false,
  goTo: null
}
