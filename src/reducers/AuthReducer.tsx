import { AuthAction } from '../actions/AuthActions'
import { initialState } from '../state/State'

export const isToGoogleReducer = (state: boolean = initialState.isToGoogle, action: AuthAction): boolean => {
  switch (action.type) {
    case 'TO_GOOGLE':
      return true
     default:
      return state
  }
}

export const isGoogleAuthenticatedReducer = (state: boolean = initialState.isGoogleAuthenticated, action: AuthAction): boolean => {
  switch (action.type) {
    case 'IS_GOOGLE_AUTHENTICATED':
      return true
    case 'LOGOUT':
      return false
     default:
      return state
  }
}

export const googleTokenReducer = (state: any = initialState.googleToken, action: AuthAction): any => {
  switch (action.type) {
    case 'GOOGLE_TOKEN':
      return action.googleToken
    case 'LOGOUT':
      return {}
     default:
      return state
  }

}

export const isToMicrosoftReducer = (state: boolean = initialState.isToMicrosoft, action: AuthAction): boolean => {
  switch (action.type) {
    case 'TO_MICROSOFT':
      return true
     default:
      return state
  }
}

export const isMicrosoftAuthenticatedReducer = (state: boolean = initialState.isMicrosoftAuthenticated, action: AuthAction): boolean => {
  switch (action.type) {
    case 'IS_MICROSOFT_AUTHENTICATED':
      return true
    case 'LOGOUT':
      return false
     default:
      return state
  }
}

export const microsoftTokenReducer = (state: any = initialState.microsoftToken, action: AuthAction): any => {
  switch (action.type) {
    case 'MICROSOFT_TOKEN':
      return action.microsoftToken
    case 'LOGOUT':
      return {}
     default:
      return state
  }

}
