import { KuberAction } from '../actions/KuberActions'
import { NotebookStore } from '../store/NotebookStore'
import { initialState } from '../state/State'

export const kuberMessageSentReducer = (state: any = initialState.kuberMessageSent, action: KuberAction): any => {
  switch (action.type) {
    case 'KUBER_MESSAGE_SENT':
      return action.message
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

export const kuberStatusReducer = (state: any = initialState.kuberStatus, action: KuberAction): any => {
  switch (action.type) {
    case 'KUBER_MESSAGE_RECEIVED':
      if (action.message.op == 'KUBER_STATUS') {
        return action.message
      }
      return state
    default:
      return state
  }
}
