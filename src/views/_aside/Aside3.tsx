import * as React from 'react'
import { connect, redux } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Aside3 extends React.Component<any, any> {

  public constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
{/*
        <h6>Settings</h6>
        <div className="aside-options">
            <div className="clearfix mt-2">
                <small><b>Option 1</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox" defaultChecked/>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
            <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
            </div>
        </div>
        <div className="aside-options">
            <div className="clearfix mt-1">
                <small><b>Option 2</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox"></input>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
            <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
            </div>
        </div>
        <div className="aside-options">
            <div className="clearfix mt-1">
                <small><b>Option 3</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox"></input>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
        </div>
        <div className="aside-options">
            <div className="clearfix mt-1">
                <small><b>Option 4</b>
                </small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                    <input className="switch-input" type="checkbox" defaultChecked></input>
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
        </div>
        <hr/>
*/}
        <h6>Cluster Usage</h6>
        <div className="text-uppercase mb-q mt-2">
            <small><b>CPU Usage</b>
            </small>
        </div>
        <div className="progress progress-xs">
            <div className="progress-bar bg-info" role="progressbar" style={{ "width": "25%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">348 Processes. 1/4 Cores.</small>
        <div className="text-uppercase mb-q mt-h">
            <small><b>Memory Usage</b>
            </small>
        </div>
        <div className="progress progress-xs">
            <div className="progress-bar bg-warning" role="progressbar" style={{ "width": "70%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">11444GB/16384MB</small>

        <div className="text-uppercase mb-q mt-h">
            <small><b>SSD 1 Usage</b>
            </small>
        </div>
        <div className="progress progress-xs">
            <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "95%" }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">243GB/256GB</small>

        <div className="text-uppercase mb-q mt-h">
            <small><b>SSD 2 Usage</b>
            </small>
        </div>
        <div className="progress progress-xs">
            <div className="progress-bar bg-success" role="progressbar" style={{ "width": "10%" }} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">25GB/256GB</small>

    </div>
   )
  }

}
