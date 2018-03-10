import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { ApplicationState } from '../state/State'
import { routerReducer } from 'react-router-redux'
import { meReducer, profilePrincipalReducer, profileDisplayNameReducer, profilePhotoBlobReducer } from './ProfileReducer'
import { newConfigReducer } from './ConfigReducer'
import { kuberMessageSentReducer, kuberMessageReceivedReducer, kuberStatusReducer } from './KuberReducer'
import { counterReducer, isSavingCounterReducer, isLoadingCounterReducer, errorCounterReducer } from './CounterReducer'
import { 
  isGoogleAuthenticatedReducer, isToGoogleReducer, googleTokenReducer, 
  isMicrosoftAuthenticatedReducer, isToMicrosoftReducer, microsoftTokenReducer, 
  isTwitterAuthenticatedReducer, isToTwitterReducer, twitterTokenReducer
 } from './AuthReducer'
import { 
  spitfireLoginReducer, spitfireMessageSentReducer, 
  spitfireMessageReceivedReducer, noteReducer, clearScratchpadReducer,
  runningParagraphsReducer, notesReducer, isStartNoteRunReducer,
  goToReducer, isStartParagraphRunReducer, scratchpadNoteIdReducer
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
  spitfireLogin: spitfireLoginReducer,
  spitfireMessageSent: spitfireMessageSentReducer,
  spitfireMessageReceived: spitfireMessageReceivedReducer,
  note: noteReducer,
  notes: notesReducer,
  scratchpadNoteId: scratchpadNoteIdReducer,
  runningParagraphs: runningParagraphsReducer,
  isStartNoteRun: isStartNoteRunReducer,
  isStartParagraphRun: isStartParagraphRunReducer,
  toastr: toastrReducer,
  routing: routerReducer,
  me: meReducer,
  profilePrincipal: profilePrincipalReducer,
  profileDisplayName: profileDisplayNameReducer,
  profilePhotoBlob: profilePhotoBlobReducer, 
  clearScratchpad: clearScratchpadReducer,
  goTo: goToReducer,
  kuberStatus: kuberStatusReducer
})
