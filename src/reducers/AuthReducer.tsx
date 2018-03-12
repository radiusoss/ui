import { AuthAction } from '../actions/AuthActions'
import { initialState } from '../state/State'


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
