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
    isStartRun: {noteId: any, paragraphId: any},
    me: any,
    profileDisplayName: string,
    profilePhoto: string,
    profilePhotoBlob: Blob,
    config: IConfig,
    k8sLogin: any,
    kuberMessageSent: any,
    kuberMessageReceived: any
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
  isStartRun: null,
  me: {},
  profileDisplayName: '',
  profilePhoto: 'img/datalayer/datalayer-square.png',
  profilePhotoBlob: new Blob(),
  config: emptyConfig,
  k8sLogin: {},
  kuberMessageSent: {},
  kuberMessageReceived: {}
}
