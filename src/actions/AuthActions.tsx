import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type AuthAction = {
  type: string,
  googleToken?: string
  microsoftToken?: string
}

export const logoutAction = (): AuthAction => ({
  type: 'LOGOUT'
})

export const isGoogleAuthenticatedAction = (): AuthAction => ({
  type: 'IS_GOOGLE_AUTHENTICATED'
})

export const toGoogleAction = (): AuthAction => ({
  type: 'TO_GOOGLE'
})

export const googleTokenAction = (googleToken: any): AuthAction => ({
  type: 'GOOGLE_TOKEN',
  googleToken: googleToken
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
  dispatchIsGoogleAuthenticatedAction: () => void
  dispatchToGoogleAction: () => void
  dispatchGoogleTokenAction: (googleToken: any) => void
  dispatchIsMicrosoftAuthenticatedAction: () => void
  dispatchToMicrosoftAction: () => void
  dispatchMicrosoftTokenAction: (microsoftToken: any) => void
}

export type AuthProps = {
  isToGoogle: boolean,
  isGoogleAuthenticated: boolean,
  googleToken: any,
  isToMicrosoft: boolean,
  isMicrosoftAuthenticated: boolean,
  microsoftToken: any,
}

export const mapDispatchToPropsAuth = (dispatch: Dispatch<ApplicationState.State>): AuthDispatchers => ({
  dispatchLogoutAction: () => {
    dispatch(logoutAction())
  },
  dispatchToGoogleAction: () => {
    dispatch(logoutAction())
    dispatch(toGoogleAction())
  },
  dispatchIsGoogleAuthenticatedAction: () => {
    dispatch(isGoogleAuthenticatedAction())
  },
  dispatchGoogleTokenAction: (googleToken: any) => {
    dispatch(googleTokenAction(googleToken))
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
  isToGoogle: state.isToGoogle,
  isGoogleAuthenticated: state.isGoogleAuthenticated,
  googleToken: state.googleToken,
  isToMicrosoft: state.isToMicrosoft,
  isMicrosoftAuthenticated: state.isMicrosoftAuthenticated,
  microsoftToken: state.microsoftToken,
})
