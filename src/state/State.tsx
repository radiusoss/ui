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
    spitfireLogin: any,
    spitfireMessageSent: any,
    spitfireMessageReceived: any,
    note: any,
    notes: any[],
    scratchpadNoteId: string,
    runningParagraphs: Map<string, any>,
    isStartNoteRun: {noteId: any},
    isStartParagraphRun: {noteId: any, paragraphId: any},
    me: any,
    profilePrincipal: string,
    profileDisplayName: string,
    profilePhoto: string,
    profilePhotoBlob: Blob,
    config: IConfig,
    kuberLogin: any,
    kuberMessageSent: any,
    kuberMessageReceived: any,
    clearScratchpad: boolean,
    goTo: string,
    kuberStatus: any
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
  spitfireLogin: {},
  spitfireMessageSent: {},
  spitfireMessageReceived: {},
  note: {},
  notes: [],
  scratchpadNoteId: '',
  runningParagraphs: new Map<string, any>(),
  isStartNoteRun: null,
  isStartParagraphRun: null,
  me: {},
  profilePrincipal: '',
  profileDisplayName: '',
  profilePhoto: 'img/datalayer/datalayer-square.png',
  profilePhotoBlob: new Blob(),
  config: emptyConfig,
  kuberLogin: {},
  kuberMessageSent: {},
  kuberMessageReceived: {},
  clearScratchpad: false,
  goTo: null,
  kuberStatus: {}
}
