import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { ApplicationState } from '../state/State'
import { routerReducer } from 'react-router-redux'
import { meReducer, profileDisplayNameReducer, profilePhotoBlobReducer } from './CommonReducer'
import { newConfigReducer } from './ConfigReducer'
import { 
  kuberMessageSentReducer, kuberMessageReceivedReducer, kuberStatusReducer
} from './KuberReducer'
import { 
  counterReducer, isSavingCounterReducer, 
  isLoadingCounterReducer, errorCounterReducer
} from './CounterReducer'
import { 
  isGoogleAuthenticatedReducer, isToGoogleReducer, googleTokenReducer, 
  isMicrosoftAuthenticatedReducer, isToMicrosoftReducer, microsoftTokenReducer, 
  isTwitterAuthenticatedReducer, isToTwitterReducer, twitterTokenReducer
 } from './AuthReducer'
import { 
  notebookLoginReducer, webSocketMessageSentReducer, 
  webSocketMessageReceivedReducer, noteReducer, clearScratchpadReducer,
  runningParagraphsReducer, notesReducer, isStartNoteRunReducer,
  goToReducer, isStartParagraphRunReducer
} from './NotebookReducer'

export const reducers = combineReducers<ApplicationState.State>({
  config: newConfigReducer,  
  counter: counterReducer,
  isSavingCounter: isSavingCounterReducer,
  isLoadingCounter: isLoadingCounterReducer,
  errorCounter: errorCounterReducer,
  kuberMessageSent: kuberMessageSentReducer,
  kuberMessageReceived: kuberMessageReceivedReducer,
  isGoogleAuthenticated: isGoogleAuthenticatedReducer,
  isToGoogle: isToGoogleReducer,
  googleToken: googleTokenReducer,
  isMicrosoftAuthenticated: isMicrosoftAuthenticatedReducer,
  isToMicrosoft: isToMicrosoftReducer,
  microsoftToken: microsoftTokenReducer,
  isTwitterAuthenticated: isTwitterAuthenticatedReducer,
  isToTwitter: isToTwitterReducer,
  twitterToken: twitterTokenReducer,
  notebookLogin: notebookLoginReducer,
  webSocketMessageSent: webSocketMessageSentReducer,
  webSocketMessageReceived: webSocketMessageReceivedReducer,
  note: noteReducer,
  notes: notesReducer,
  runningParagraphs: runningParagraphsReducer,
  isStartNoteRun: isStartNoteRunReducer,
  isStartParagraphRun: isStartParagraphRunReducer,
  toastr: toastrReducer,
  routing: routerReducer,
  me: meReducer,
  profileDisplayName: profileDisplayNameReducer,
  profilePhotoBlob: profilePhotoBlobReducer, 
  clearScratchpad: clearScratchpadReducer,
  goTo: goToReducer,
  kuberStatus: kuberStatusReducer
})
