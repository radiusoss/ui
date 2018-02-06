import { KuberAction } from '../actions/KuberActions'
import { NotebookStore } from '../store/NotebookStore'
import { initialState } from '../state/State'

export const kuberMessageSentReducer = (state: any = initialState.kuberMessageSent, action: KuberAction): any => {
  switch (action.type) {
    case 'KUBER_MESSAGE_SENT':
      if (action.message.op == 'RUN_ALL_PARAGRAPHS_SPITFIRE') {
        NotebookStore.state().runningParagraphs = NotebookStore.state().runningParagraphs.concat(action.message.data.paragraphs)
        return action.message
      }
      return {}
    default:
      return {}
  }
}

export const kuberMessageReceivedReducer = (state: any = initialState.kuberMessageReceived, action: KuberAction): any => {
  switch (action.type) {
    case 'KUBER_MESSAGE_RECEIVED':
      return action.message
    default:
      return {}
  }
}
