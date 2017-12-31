import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type K8sAction = {
  type: string
  message?: any
}

export const k8sMessageSentAction = (message: any): K8sAction => ({
  type: 'K8S_MESSAGE_SENT',
  message: message
})
export const k8sMessageReceivedAction = (message: any): K8sAction => ({
  type: 'K8S_MESSAGE_RECEIVED',
  message: message
})

export type K8sProps = {
  k8sLogin: {},
  k8sMessageSent: any,
  k8sMessageReceived: any,
}

export const mapStateToPropsK8s = (state: ApplicationState.State): K8sProps => ({
  k8sLogin: state.k8sLogin,
  k8sMessageSent: state.k8sMessageSent,
  k8sMessageReceived: state.k8sMessageReceived,
})

export type K8sDispatchers = {
  dispatchK8sMessageSentAction: (any) => void
  dispatchK8sMessageReceivedAction: (any) => void
}

export const mapDispatchToPropsK8s = (dispatch: Dispatch<ApplicationState.State>): K8sDispatchers => ({
  dispatchK8sMessageSentAction: (message: any) => {
    dispatch(k8sMessageSentAction(message))
  },
  dispatchK8sMessageReceivedAction: (message: any) => {
    dispatch(k8sMessageReceivedAction(message))
  }
})
