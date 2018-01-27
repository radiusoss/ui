import * as React from 'react'
import * as ReactDOM from 'react-dom';
import FabricIcon from '../components/FabricIcon'

export default class Footer extends React.Component<any, any> {
  render() {
    return (
      <footer className="app-footer">
        Powered by <a href="http://www.apache.org" target="_blank">Apache</a> and <a href="https://www.linuxfoundation.org/" target="_blank">Linux</a> Foundations Software
        <span className="float-right">
          Made with <FabricIcon name="Heart" /> by <a href="http://datalayer.io" target="_blank">Datalayer</a> &copy; 2017-2018
          </span>
      </footer>
    )
  }
}
