import { K8sAction } from '../actions/K8sActions'
import { NotebookStore } from '../store/NotebookStore'
import { initialState } from '../state/State'

export const k8sMessageSentReducer = (state: any = initialState.k8sMessageSent, action: K8sAction): any => {
  switch (action.type) {
    case 'K8S_MESSAGE_SENT':
      if (action.message.op == 'RUN_ALL_PARAGRAPHS_SPITFIRE') {
        NotebookStore.state().runningParagraphs = NotebookStore.state().runningParagraphs.concat(action.message.data.paragraphs)
        return action.message
      }
      return {}
    default:
      return {}
  }
}

export const k8sMessageReceivedReducer = (state: any = initialState.k8sMessageReceived, action: K8sAction): any => {
  switch (action.type) {
    case 'K8S_MESSAGE_RECEIVED':
      return action.message
    default:
      return {}
  }
}
