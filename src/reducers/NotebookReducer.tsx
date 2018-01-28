import { NotebookAction } from '../actions/NotebookActions'
import { NotebookStore } from '../store/NotebookStore'
import { initialState } from '../state/State'

export const notebookLoginReducer = (state: {} = initialState.notebookLogin, action: NotebookAction): {} => {
  switch (action.type) {
    case 'NOTEBOOK_TICKET':
      return action.message
    default:
      return state
  }
}

export const webSocketMessageSentReducer = (state: any = initialState.webSocketMessageSent, action: NotebookAction): any => {
  switch (action.type) {
    case 'WS_MESSAGE_SENT':
      if (action.message.op == 'RUN_ALL_PARAGRAPHS_SPITFIRE') {
        NotebookStore.state().runningParagraphs = NotebookStore.state().runningParagraphs.concat(action.message.data.paragraphs)
        return action.message
      }
      return {}
    default:
      return {}
  }
}

export const webSocketMessageReceivedReducer = (state: any = initialState.webSocketMessageReceived, action: NotebookAction): any => {
  switch (action.type) {
    case 'WS_MESSAGE_RECEIVED':
      return action.message
    default:
      return {}
  }
}

export const runningParagraphsReducer = (state: any[] = initialState.runningParagraphs, action: NotebookAction): any[] => {
  switch (action.type) {
    case 'WS_MESSAGE_SENT':
      if (action.message.op == 'RUN_ALL_PARAGRAPHS_SPITFIRE') {
        return state.concat(action.message.data.paragraphs)
      }
      return state
    default:
      return state
  }
}

export const isStartRunReducer = (state: {noteId: any, paragraphId: any} = initialState.isStartRun, action: NotebookAction): {noteId: any, paragraphId: any} => {
  switch (action.type) {
    case 'RUN_NOTE':
      return {noteId: action.message.noteId, paragraphId: action.message.paragraphId}
    default:
      return state
  }
}

export const noteReducer = (state: any = initialState.note, action: NotebookAction): any => {
  switch (action.type) {
    case 'WS_MESSAGE_RECEIVED':
      if (action.message.op == 'NOTE') {
        return action.message.data.note
      }
      return {}
    default:
      return {}
  }
}

export const notesReducer = (state: any[] = initialState.notes, action: NotebookAction): any[] => {
  switch (action.type) {
    case 'WS_MESSAGE_RECEIVED':
      if (action.message.op == 'NOTES_INFO') {
        return action.message.data.notes
      }
      return []
    default:
      return []
  }
}
