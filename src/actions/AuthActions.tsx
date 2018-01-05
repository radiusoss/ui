import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type AuthAction = {
  type: string,
  microsoftToken?: string
  twitterToken?: string
}

export const logoutAction = (): AuthAction => ({
  type: 'LOGOUT'
})

export const isMicrosoftAuthenticatedAction = (): AuthAction => ({
  type: 'IS_AAD_AUTHENTICATED'
})

export const toMicrosoftAction = (): AuthAction => ({
  type: 'TO_AAD'
})

export const microsoftTokenAction = (microsoftToken: any): AuthAction => ({
  type: 'AAD_TOKEN',
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
  dispatchIsMicrosoftAuthenticatedAction: () => void
  dispatchToMicrosoftAction: () => void
  dispatchMicrosoftTokenAction: (microsoftToken: any) => void
  dispatchIsTwitterAuthenticatedAction: () => void
  dispatchToTwitterAction: () => void
  dispatchTwitterTokenAction: (twitterToken: any) => void
}

export type AuthProps = {
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
  isToMicrosoft: state.isToMicrosoft,
  isMicrosoftAuthenticated: state.isMicrosoftAuthenticated,
  microsoftToken: state.microsoftToken,
  isToTwitter: state.isToTwitter,
  isTwitterAuthenticated: state.isTwitterAuthenticated,
  twitterToken: state.twitterToken
})
