import { AuthAction } from '../actions/AuthActions'
import { initialState } from '../state/State'

export const isToAadReducer = (state: boolean = initialState.isToAad, action: AuthAction): boolean => {
  switch (action.type) {
    case 'TO_AAD':
      return true
     default:
      return state
  }
}

export const isAadAuthenticatedReducer = (state: boolean = initialState.isAadAuthenticated, action: AuthAction): boolean => {
  switch (action.type) {
    case 'IS_AAD_AUTHENTICATED':
      return true
    case 'LOGOUT':
      return false
     default:
      return state
  }
}

export const aadTokenReducer = (state: any = initialState.aadToken, action: AuthAction): any => {
  switch (action.type) {
    case 'AAD_TOKEN':
      return action.aadToken
    case 'LOGOUT':
      return {}
     default:
      return state
  }

}

export const isToTwitterReducer = (state: boolean = initialState.isToTwitter, action: AuthAction): boolean => {
  switch (action.type) {
    case 'TO_TWITTER':
      return true
     default:
      return state
  }
}

export const isTwitterAuthenticatedReducer = (state: boolean = initialState.isTwitterAuthenticated, action: AuthAction): boolean => {
  switch (action.type) {
    case 'IS_TWITTER_AUTHENTICATED':
      return true
    case 'LOGOUT':
      return false
     default:
      return state
  }
}

export const twitterTokenReducer = (state: any = initialState.twitterToken, action: AuthAction): any => {
  switch (action.type) {
    case 'TWITTER_TOKEN':
      return action.twitterToken
    case 'LOGOUT':
      return {}
     default:
      return state
  }

}
