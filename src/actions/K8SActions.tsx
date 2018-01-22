import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type K8SAction = {
  type: string
  message?: any
}

export const k8sMessageSentAction = (message: any): K8SAction => ({
  type: 'K8S_MESSAGE_SENT',
  message: message
})
export const k8sMessageReceivedAction = (message: any): K8SAction => ({
  type: 'K8S_MESSAGE_RECEIVED',
  message: message
})

export type K8SProps = {
  k8sLogin: {},
  k8sMessageSent: any,
  k8sMessageReceived: any,
}

export const mapStateToPropsK8S = (state: ApplicationState.State): K8SProps => ({
  k8sLogin: state.k8sLogin,
  k8sMessageSent: state.k8sMessageSent,
  k8sMessageReceived: state.k8sMessageReceived,
})

export type K8SDispatchers = {
  dispatchK8SMessageSentAction: (any) => void
  dispatchK8SMessageReceivedAction: (any) => void
}

export const mapDispatchToPropsK8S = (dispatch: Dispatch<ApplicationState.State>): K8SDispatchers => ({
  dispatchK8SMessageSentAction: (message: any) => {
    dispatch(k8sMessageSentAction(message))
  },
  dispatchK8SMessageReceivedAction: (message: any) => {
    dispatch(k8sMessageReceivedAction(message))
  }
})
