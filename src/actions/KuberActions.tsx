import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type KuberAction = {
  type: string
  message?: any
}

export const kuberMessageSentAction = (message: any): KuberAction => ({
  type: 'KUBER_MESSAGE_SENT',
  message: message
})
export const kuberMessageReceivedAction = (message: any): KuberAction => ({
  type: 'KUBER_MESSAGE_RECEIVED',
  message: message
})

export type KuberProps = {
  kuberLogin: {},
  kuberMessageSent: any,
  kuberMessageReceived: any,
}

export const mapStateToPropsKuber = (state: ApplicationState.State): KuberProps => ({
  kuberLogin: state.kuberLogin,
  kuberMessageSent: state.kuberMessageSent,
  kuberMessageReceived: state.kuberMessageReceived,
})

export type KuberDispatchers = {
  dispatchKuberMessageSentAction: (any) => void
  dispatchKuberMessageReceivedAction: (any) => void
}

export const mapDispatchToPropsKuber = (dispatch: Dispatch<ApplicationState.State>): KuberDispatchers => ({
  dispatchKuberMessageSentAction: (message: any) => {
    dispatch(kuberMessageSentAction(message))
  },
  dispatchKuberMessageReceivedAction: (message: any) => {
    dispatch(kuberMessageReceivedAction(message))
  }
})
