import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type AuthAction = {
  type: string,
  microsoftToken?: string
}

export const logoutAction = (): AuthAction => ({
  type: 'LOGOUT'
})

export const isMicrosoftAuthenticatedAction = (): AuthAction => ({
  type: 'IS_MICROSOFT_AUTHENTICATED'
})

export const toMicrosoftAction = (): AuthAction => ({
  type: 'TO_MICROSOFT'
})

export const microsoftTokenAction = (microsoftToken: any): AuthAction => ({
  type: 'MICROSOFT_TOKEN',
  microsoftToken: microsoftToken
})

export type AuthDispatchers = {
  dispatchLogoutAction: () => void
  dispatchIsMicrosoftAuthenticatedAction: () => void
  dispatchToMicrosoftAction: () => void
  dispatchMicrosoftTokenAction: (microsoftToken: any) => void
}

export type AuthProps = {
  isToMicrosoft: boolean,
  isMicrosoftAuthenticated: boolean,
  microsoftToken: any,
}

export const mapDispatchToPropsAuth = (dispatch: Dispatch<ApplicationState.State>): AuthDispatchers => ({
  dispatchLogoutAction: () => {
    dispatch(logoutAction())
  },
  dispatchToMicrosoftAction: () => {
    dispatch(logoutAction())
    dispatch(toMicrosoftAction())
  },
  dispatchIsMicrosoftAuthenticatedAction: () => {
    dispatch(isMicrosoftAuthenticatedAction())
  },
  dispatchMicrosoftTokenAction: (microsoftToken: any) => {
    dispatch(microsoftTokenAction(microsoftToken))
  },
})

export const mapStateToPropsAuth = (state: ApplicationState.State): AuthProps => ({
  isToMicrosoft: state.isToMicrosoft,
  isMicrosoftAuthenticated: state.isMicrosoftAuthenticated,
  microsoftToken: state.microsoftToken,
})
