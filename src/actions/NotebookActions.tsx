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
export const runNote = (): NotebookAction => ({
  type: 'RUN_NOTE'
})
export const stopNote = (id: string): NotebookAction => ({
  type: 'STOP_NOTE',
  message: id
})

export type NotebookProps = {
  notebookLogin: {},
  webSocketMessageSent: any,
  webSocketMessageReceived: any,
  note: any,
  notes: any,
  runningParagraphs: any[],
  isStartRun: boolean
}

export const mapStateToPropsNotebook = (state: ApplicationState.State): NotebookProps => ({
  notebookLogin: state.notebookLogin,
  webSocketMessageSent: state.webSocketMessageSent,
  webSocketMessageReceived: state.webSocketMessageReceived,
  note: state.note,
  notes: state.notes,
  runningParagraphs: state.runningParagraphs,
  isStartRun: state.isStartRun
})

export type NotebookDispatchers = {
  dispatchGetTicketAction: (string) => void
  dispatchWsMessageSentAction: (any) => void
  dispatchWsMessageReceivedAction: (any) => void
  dispatchRunNoteAction: () => void
  dispatchStopNoteAction: (string) => void
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
  dispatchRunNoteAction: () => { 
    dispatch(runNote())
  },
  dispatchStopNoteAction: (message: string) => {
    dispatch(stopNote(message))
  }
})
