import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { initializeIcons } from '@uifabric/icons'
import routerHistory from './routes/History'
import Routes from './routes/Routes'
import ReduxToastr from 'react-redux-toastr'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { NotebookStore } from './store/NotebookStore'
import Config from './config/Config'
import MicrosoftApi from './api/microsoft/MicrosoftApi'
import NotebookApi from './api/notebook/NotebookApi'
import SpitfireApi from './api/spitfire/SpitfireApi'
import TwitterApi from './api/twitter/TwitterApi'
import K8sApi from './api/k8s/K8sApi'
import { loadTheme } from 'office-ui-fabric-react/lib/Styling';

loadTheme({
  palette: {
    'themePrimary': '#038387'
  }
})

document.getElementById('preloader').style.display = 'none'

let div: HTMLElement = document.createElement('div')
document.body.appendChild(div)

function start(): void {
  window.addEventListener('DOMContentLoaded', () => {
//    console.clear()
    initializeIcons()
    ReactDOM.render(
      <div>
        <Provider store={NotebookStore.notebookStore}>
          <div>
            <Config/>
            <SpitfireApi/>
            <K8sApi/>
            <TwitterApi/>
            <MicrosoftApi/>
            <NotebookApi/>
            <ConnectedRouter history = { routerHistory } >
              <Routes />
            </ConnectedRouter>
            <ReduxToastr
              timeOut={4000}
              newestOnTop={false}
              preventDuplicates
              position="top-right"
              transitionIn="fadeIn"
              transitionOut="fadeOut"
              progressBar
            />
          </div>
        </Provider>
      </div>
      ,
    div
    )
/*
    if (window.location.hostname.endsWith("localhost")) {
      setTimeout(function () {
      history.push('/dla/notes')
      history.push(window.location.hash.substr(1))
      history.goBack()
      window.location.reload
      }, 100)
    }
*/
  })
}

start()
