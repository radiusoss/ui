import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type NotebookAction = {
  type: string
  message?: any
}

export const spitfireTicketAction = (spitfireLogin: string): NotebookAction => ({
  type: 'SPITFIRE_TICKET',
  message: spitfireLogin
})

export const spitfireMessageSentAction = (message: any): NotebookAction => ({
  type: 'SPITFIRE_MESSAGE_SENT',
  message: message
})

export const spitfireMessageReceivedAction = (message: any): NotebookAction => ({
  type: 'SPITFIRE_MESSAGE_RECEIVED',
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
  spitfireLogin: {},
  spitfireMessageSent: any,
  spitfireMessageReceived: any,
  note: any,
  notes: any,
  runningParagraphs: Map<string, any>,
  isStartNoteRun: {noteId: any},
  isStartParagraphRun: {noteId: any, paragraphId: any},
  clearScratchpad: boolean,
  goTo: string
}

export const mapStateToPropsNotebook = (state: ApplicationState.State): NotebookProps => ({
  spitfireLogin: state.spitfireLogin,
  spitfireMessageSent: state.spitfireMessageSent,
  spitfireMessageReceived: state.spitfireMessageReceived,
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
  dispatchGetTicketAction: (spitfireLogin: string) => {
    dispatch(spitfireTicketAction(spitfireLogin))
  },
  dispatchWsMessageSentAction: (message: any) => {
    dispatch(spitfireMessageSentAction(message))
  },
  dispatchWsMessageReceivedAction: (message: any) => {
    dispatch(spitfireMessageReceivedAction(message))
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
