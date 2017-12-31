import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type AuthAction = {
  type: string,
  aadToken?: string
  twitterToken?: string
}

export const logoutAction = (): AuthAction => ({
  type: 'LOGOUT'
})

export const isAadAuthenticatedAction = (): AuthAction => ({
  type: 'IS_AAD_AUTHENTICATED'
})

export const toAadAction = (): AuthAction => ({
  type: 'TO_AAD'
})

export const aadTokenAction = (aadToken: any): AuthAction => ({
  type: 'AAD_TOKEN',
  aadToken: aadToken
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
  dispatchIsAadAuthenticatedAction: () => void
  dispatchToAadAction: () => void
  dispatchAadTokenAction: (aadToken: any) => void
  dispatchIsTwitterAuthenticatedAction: () => void
  dispatchToTwitterAction: () => void
  dispatchTwitterTokenAction: (twitterToken: any) => void
}

export type AuthProps = {
  isToAad: boolean,
  isAadAuthenticated: boolean,
  aadToken: any,
  isToTwitter: boolean,
  isTwitterAuthenticated: boolean,
  twitterToken: any
}

export const mapDispatchToPropsAuth = (dispatch: Dispatch<ApplicationState.State>): AuthDispatchers => ({
  dispatchLogoutAction: () => {
    dispatch(logoutAction())
  },
  dispatchToAadAction: () => {
    dispatch(logoutAction())
    dispatch(toAadAction())
  },
  dispatchIsAadAuthenticatedAction: () => {
    dispatch(isAadAuthenticatedAction())
  },
  dispatchAadTokenAction: (aadToken: any) => {
    dispatch(aadTokenAction(aadToken))
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
  isToAad: state.isToAad,
  isAadAuthenticated: state.isAadAuthenticated,
  aadToken: state.aadToken,
  isToTwitter: state.isToTwitter,
  isTwitterAuthenticated: state.isTwitterAuthenticated,
  twitterToken: state.twitterToken
})
