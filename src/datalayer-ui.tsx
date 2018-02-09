import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { initializeIcons } from '@uifabric/icons'
import routerHistory from './routes/History'
import Routes from './routes/Routes'
import ReduxToastr from 'react-redux-toastr'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { NotebookStore } from './store/NotebookStore'
import ConfigApi from './api/config/ConfigApi'
import GoogleApi from './api/google/GoogleApi'
import MicrosoftApi from './api/microsoft/MicrosoftApi'
import TwitterApi from './api/twitter/TwitterApi'
import NotebookApi from './api/notebook/NotebookApi'
import SpitfireApi from './api/spitfire/SpitfireApi'
import KuberApi from './api/kuber/KuberApi'
import { loadTheme } from 'office-ui-fabric-react/lib/Styling';

/*
46 204 113  datalayer-green-light  #2ecc71
26 188 156  datalayer-green-main   #1abc9c
22 160 133  datalayer-green-dark   #16a085
89 89 92    datalayer-gray   #59595c
0 0 0       datalayer-black  #000000
255 255 255 datlayer-white   #FFFFFF
*/
loadTheme({
  palette: {
    'themePrimary': '#038387',
    'themeDarkAlt': '#16a085'
//    'themeDarkAlt': '#20a8d8'
  }
})

document.getElementById('preloader').style.display = 'none'

var div: HTMLElement = document.createElement('div')
document.body.appendChild(div)

function start(): void {
  window.addEventListener('DOMContentLoaded', () => {
//    console.clear()
    initializeIcons()
    ReactDOM.render(
      <div>
        <Provider store={NotebookStore.notebookStore}>
          <div>
            <ConfigApi/>
            <SpitfireApi/>
            <KuberApi/>
            <GoogleApi/>
            <MicrosoftApi/>
            <TwitterApi/>
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
