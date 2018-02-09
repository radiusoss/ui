import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type NotebookAction = {
  type: string
  message?: any
}

export const notebookTicketAction = (notebookLogin: string): NotebookAction => ({
  type: 'NOTEBOOK_TICKET',
  message: notebookLogin
})

export const webSocketMessageSentAction = (message: any): NotebookAction => ({
  type: 'WS_MESSAGE_SENT',
  message: message
})

export const webSocketMessageReceivedAction = (message: any): NotebookAction => ({
  type: 'WS_MESSAGE_RECEIVED',
  message: message
})

export const runNote = (message: any): NotebookAction => ({
  type: 'RUN_NOTE',
  message: message
})

export const stopNote = (id: string): NotebookAction => ({
  type: 'STOP_NOTE',
  message: id
})

export const clearScratchpad = (): NotebookAction => ({
  type: 'CLEAR_SCRATCHPAD'
})

export type NotebookProps = {
  notebookLogin: {},
  webSocketMessageSent: any,
  webSocketMessageReceived: any,
  note: any,
  notes: any,
  runningParagraphs: any[],
  isStartRun: {noteId: any, paragraphId: any},
  clearScratchpad: boolean
}

export const mapStateToPropsNotebook = (state: ApplicationState.State): NotebookProps => ({
  notebookLogin: state.notebookLogin,
  webSocketMessageSent: state.webSocketMessageSent,
  webSocketMessageReceived: state.webSocketMessageReceived,
  note: state.note,
  notes: state.notes,
  runningParagraphs: state.runningParagraphs,
  isStartRun: state.isStartRun,
  clearScratchpad: state.clearScratchpad
})

export type NotebookDispatchers = {
  dispatchGetTicketAction: (string) => void
  dispatchWsMessageSentAction: (any) => void
  dispatchWsMessageReceivedAction: (any) => void
  dispatchRunNoteAction: (noteId, paragraphId) => void
  dispatchStopNoteAction: (string) => void
  dispatchClearScratchpad: () => void
}

export const mapDispatchToPropsNotebook = (dispatch: Dispatch<ApplicationState.State>): NotebookDispatchers => ({
  dispatchGetTicketAction: (notebookLogin: string) => {
    dispatch(notebookTicketAction(notebookLogin))
  },
  dispatchWsMessageSentAction: (message: any) => {
    dispatch(webSocketMessageSentAction(message))
  },
  dispatchWsMessageReceivedAction: (message: any) => {
    dispatch(webSocketMessageReceivedAction(message))
  },
  dispatchRunNoteAction: (noteId: any, paragraphId: any) => { 
    dispatch(runNote({noteId: noteId, paragraphId: paragraphId}))
  },
  dispatchStopNoteAction: (message: string) => {
    dispatch(stopNote(message))
  },
  dispatchClearScratchpad: () => {
    dispatch(clearScratchpad())
  }
})
