import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'

import { ApplicationState } from '../state/State'
import { routerReducer } from 'react-router-redux'

import { profileDisplayNameReducer, profilePhotoBlobReducer } from './CommonReducer'
import { newConfigReducer } from './ConfigReducer'
import { k8sMessageSentReducer, k8sMessageReceivedReducer } from './K8sReducer'
import { counterReducer, isSavingCounterReducer, isLoadingCounterReducer, errorCounterReducer } from './CounterReducer'
import { isAadAuthenticatedReducer, isToAadReducer, aadTokenReducer, isTwitterAuthenticatedReducer, isToTwitterReducer, twitterTokenReducer } from './AuthReducer'
import { notebookLoginReducer, webSocketMessageSentReducer, webSocketMessageReceivedReducer, noteReducer, runningParagraphsReducer, notesReducer, isStartRunReducer } from './NotebookReducer'

export const reducers = combineReducers<ApplicationState.State>({

  config: newConfigReducer,
  
  counter: counterReducer,
  isSavingCounter: isSavingCounterReducer,
  isLoadingCounter: isLoadingCounterReducer,
  errorCounter: errorCounterReducer,

  k8sMessageSent: k8sMessageSentReducer,
  k8sMessageReceived: k8sMessageReceivedReducer,

  isAadAuthenticated: isAadAuthenticatedReducer,
  isToAad: isToAadReducer,
  aadToken: aadTokenReducer,
  
  isTwitterAuthenticated: isTwitterAuthenticatedReducer,
  isToTwitter: isToTwitterReducer,
  twitterToken: twitterTokenReducer,
  
  notebookLogin: notebookLoginReducer,
  webSocketMessageSent: webSocketMessageSentReducer,
  webSocketMessageReceived: webSocketMessageReceivedReducer,

  note: noteReducer,
  notes: notesReducer,
  runningParagraphs: runningParagraphsReducer,
  isStartRun: isStartRunReducer,

  toastr: toastrReducer,
  routing: routerReducer,

  profileDisplayName: profileDisplayNameReducer,
  profilePhotoBlob: profilePhotoBlobReducer

})
