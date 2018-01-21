import * as redux from 'redux'
import { IConfig, emptyConfig } from '../config/Config'

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
    isStartRun: boolean,
    me: any,
    profileDisplayName: string,
    profilePhoto: string,
    profilePhotoBlob: Blob,
    config: IConfig,
    k8sLogin: any,
    k8sMessageSent: any,
    k8sMessageReceived: any
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
  isStartRun: false,
  me: {},
  profileDisplayName: '',
  profilePhoto: 'img/datalayer/datalayer-square.png',
  profilePhotoBlob: new Blob(),
  config: emptyConfig,
  k8sLogin: {},
  k8sMessageSent: {},
  k8sMessageReceived: {}
}
