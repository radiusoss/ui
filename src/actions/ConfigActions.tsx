import { Dispatch } from 'redux'
import { ApplicationState } from '../state/State'
import { IConfig } from '../config/Config'

export type ConfigAction = {
  type: string,
  config?: IConfig
}

export const newConfigAction = (config: IConfig): ConfigAction => ({
  type: 'NEW_CONFIG',
  config: config
})

export type ConfigDispatchers = {
  dispatchNewConfigAction: (config: IConfig) => void
}

export type ConfigProps = {
  config: IConfig
}

export const mapDispatchToPropsConfig = (dispatch: Dispatch<ApplicationState.State>): ConfigDispatchers => ({
  dispatchNewConfigAction: (config: IConfig) => {
    dispatch(newConfigAction(config))
  }
})

export const mapStateToPropsConfig = (state: ApplicationState.State): ConfigProps => ({
  config: state.config
})
