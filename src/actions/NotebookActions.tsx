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

export const runParagraph = (message: any): NotebookAction => ({
  type: 'RUN_PARAGRAPH',
  message: message
})

export const stopNote = (id: string): NotebookAction => ({
  type: 'STOP_NOTE',
  message: id
})

export const clearScratchpad = (): NotebookAction => ({
  type: 'CLEAR_SCRATCHPAD'
})

export const goTo = (path: string): NotebookAction => ({
  type: 'GO_HOME',
  message: path
})

export type NotebookProps = {
  notebookLogin: {},
  webSocketMessageSent: any,
  webSocketMessageReceived: any,
  note: any,
  notes: any,
  runningParagraphs: {},
  isStartNoteRun: {noteId: any},
  isStartParagraphRun: {noteId: any, paragraphId: any},
  clearScratchpad: boolean,
  goTo: string
}

export const mapStateToPropsNotebook = (state: ApplicationState.State): NotebookProps => ({
  notebookLogin: state.notebookLogin,
  webSocketMessageSent: state.webSocketMessageSent,
  webSocketMessageReceived: state.webSocketMessageReceived,
  note: state.note,
  notes: state.notes,
  runningParagraphs: state.runningParagraphs,
  isStartNoteRun: state.isStartNoteRun,
  isStartParagraphRun: state.isStartParagraphRun,
  clearScratchpad: state.clearScratchpad,
  goTo: state.goTo
})

export type NotebookDispatchers = {
  dispatchGetTicketAction: (string) => void
  dispatchWsMessageSentAction: (any) => void
  dispatchWsMessageReceivedAction: (any) => void
  dispatchRunNoteAction: (noteId,) => void
  dispatchRunParagraphAction: (noteId, paragraphId) => void
  dispatchStopNoteAction: (string) => void
  dispatchClearScratchpadAction: () => void
  dispatchGoToAction: (path: string) => void
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
  dispatchRunNoteAction: (noteId: any) => { 
    dispatch(runNote({noteId: noteId}))
  },
  dispatchRunParagraphAction: (noteId: any, paragraphId: any) => { 
    dispatch(runParagraph({noteId: noteId, paragraphId: paragraphId}))
  },
  dispatchStopNoteAction: (message: string) => {
    dispatch(stopNote(message))
  },
  dispatchClearScratchpadAction: () => {
    dispatch(clearScratchpad())
  },
  dispatchGoToAction: (path: string) => {
    dispatch(goTo(path))
  }
})
