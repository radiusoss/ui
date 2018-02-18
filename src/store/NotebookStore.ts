import * as redux from 'redux'
import { Store } from 'redux'
import thunk from 'redux-thunk'
import routerHistory from './../history/History'
import { routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { ApplicationState, initialState } from './../state/State'
import { reducers } from './../reducers/Reducers'

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rm = routerMiddleware(routerHistory)

export class NotebookStore {

  public static notebookStore: Store<ApplicationState.State> = redux.createStore(
    reducers,
    initialState as ApplicationState.State,
//    applyMiddleware(middleware)
    compose(applyMiddleware(thunk, rm))
  )

  public static state(): ApplicationState.State {
    return this.notebookStore.getState()
  }

}
