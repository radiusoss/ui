import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type AuthAction = {
  type: string,
  googleToken?: string
  microsoftToken?: string
  twitterToken?: string
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

export const isTwitterAuthenticatedAction = (): AuthAction => ({
  type: 'IS_TWITTER_AUTHENTICATED'
})

export const toTwitterAction = (): AuthAction => ({
  type: 'TO_TWITTER'
})

export const twitterTokenAction = (twitterToken: any): AuthAction => ({
  type: 'TWITTER_TOKEN',
  twitterToken: twitterToken
})

export type AuthDispatchers = {
  dispatchLogoutAction: () => void
  dispatchIsGoogleAuthenticatedAction: () => void
  dispatchToGoogleAction: () => void
  dispatchGoogleTokenAction: (googleToken: any) => void
  dispatchIsMicrosoftAuthenticatedAction: () => void
  dispatchToMicrosoftAction: () => void
  dispatchMicrosoftTokenAction: (microsoftToken: any) => void
  dispatchIsTwitterAuthenticatedAction: () => void
  dispatchToTwitterAction: () => void
  dispatchTwitterTokenAction: (twitterToken: any) => void
}

export type AuthProps = {
  isToGoogle: boolean,
  isGoogleAuthenticated: boolean,
  googleToken: any,
  isToMicrosoft: boolean,
  isMicrosoftAuthenticated: boolean,
  microsoftToken: any,
  isToTwitter: boolean,
  isTwitterAuthenticated: boolean,
  twitterToken: any
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
  dispatchToTwitterAction: () => {
    dispatch(logoutAction())
    dispatch(toTwitterAction())
  },
  dispatchIsTwitterAuthenticatedAction: () => {
    dispatch(isTwitterAuthenticatedAction())
  },
  dispatchTwitterTokenAction: (twitterToken: any) => {
    dispatch(twitterTokenAction(twitterToken))
  }
})

export const mapStateToPropsAuth = (state: ApplicationState.State): AuthProps => ({
  isToGoogle: state.isToGoogle,
  isGoogleAuthenticated: state.isGoogleAuthenticated,
  googleToken: state.googleToken,
  isToMicrosoft: state.isToMicrosoft,
  isMicrosoftAuthenticated: state.isMicrosoftAuthenticated,
  microsoftToken: state.microsoftToken,
  isToTwitter: state.isToTwitter,
  isTwitterAuthenticated: state.isTwitterAuthenticated,
  twitterToken: state.twitterToken
})
