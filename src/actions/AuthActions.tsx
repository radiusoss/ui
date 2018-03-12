import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'

export type AuthAction = {
  type: string,
}

export const logoutAction = (): AuthAction => ({
  type: 'LOGOUT'
})


export type AuthDispatchers = {
  dispatchLogoutAction: () => void
}

export type AuthProps = {
}

export const mapDispatchToPropsAuth = (dispatch: Dispatch<ApplicationState.State>): AuthDispatchers => ({
  dispatchLogoutAction: () => {
    dispatch(logoutAction())
  },
})

export const mapStateToPropsAuth = (state: ApplicationState.State): AuthProps => ({
})
