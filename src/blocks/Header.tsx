import * as React from 'react'
import * as classNames from 'classnames';
import NotebookControlBar from './../views/_control/NotebookControlBar'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

export interface HeaderState { 
  dropdownOpen: boolean
}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Header extends React.Component<any, HeaderState> {

  state = {
    dropdownOpen: false
  }

  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
  }

  render() {
    return (
      <header className="app-header navbar">
        <button className="navbar-toggler mobile-sidebar-toggler hidden-lg-up" onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
        <a className="navbar-brand" href="#"></a>
        <ul className="nav navbar-nav hidden-md-down">
          <li className="nav-item">
            <a className="nav-link navbar-toggler sidebar-toggler" onClick={this.sidebarToggle} href="#">&#9776;</a>
          </li>
          <li className="nav-item" style={{ textAlign: 'left' }}>
            <NotebookControlBar isSearchBoxVisible={ false } />
          </li>
{/*
          <li className="nav-item px-1">
              <a className="nav-link" href="#">Dashboard</a>
          </li>
          <li className="nav-item px-1">
              <a className="nav-link" href="#">Users</a>
          </li>
          <li className="nav-item px-1">
              <a className="nav-link" href="#">Settings</a>
          </li>
*/}
        </ul>
        <ul className="nav navbar-nav ml-auto">
{/*
          <li className="nav-item hidden-md-down">
              <a className="nav-link" href="#"><i className="icon-bell"></i><span className="badge badge-pill badge-danger">5</span></a>
          </li>
          <li className="nav-item hidden-md-down">
              <a className="nav-link" href="#"><i className="icon-list"></i></a>
          </li>
          <li className="nav-item hidden-md-down">
              <a className="nav-link" href="#"><i className="icon-location-pin"></i></a>
          </li>
          <li className="nav-item">
            <div className={classNames({ show: this.state.dropdownOpen }, 'dropdown')} >
            <a onClick={e => this.toggle(e)} className="nav-link dropdown-toggle nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
              <img src="img/avatars/1.jpg" className="img-avatar" alt="info@datalayer.io"/>
              <span className="hidden-md-down">admin</span>
            </a>
*/}
            <div aria-hidden="true" role="menu" className="dropdown-menu-right dropdown-menu">
{/*
              <h6 className="text-center dropdown-header">
                <strong>Account</strong>
              </h6>
              <button className="dropdown-item">
                <i className="fa fa-bell-o"></i>
                Updates
                <span className="badge badge-info">42</span>
              </button>
              <button className="dropdown-item">
                <i className="fa fa-envelope-o"></i>
                Messages
                <span className="badge badge-success">42</span>
              </button>
              <button className="dropdown-item">
                <i className="fa fa-tasks"></i>
                Tasks
                <span className="badge badge-danger">42</span>
              </button>
              <button className="dropdown-item">
                <i className="fa fa-comments"></i>
                Comments
                <span className="badge badge-warning">42</span>
              </button>
              <h6 className="text-center dropdown-header">
                <strong>Settings</strong>
              </h6>
              <button className="dropdown-item">
                <i className="fa fa-user"></i>
                Profile
              </button>
              <button className="dropdown-item">
                <i className="fa fa-wrench"></i>
                Settings
              </button>
              <button className="dropdown-item">
                <i className="fa fa-usd"></i>
                Payments
                <span className="badge badge-default">42</span>
              </button>
              <button className="dropdown-item">
                <i className="fa fa-file"></i>
                Projects
                <span className="badge badge-primary">42</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <i className="fa fa-shield"></i>
                Lock Account
              </button>
              <button className="dropdown-item">
                <i className="fa fa-lock"></i>
                Logout
              </button>
            </div>
*/}
            </div>
{/*
          </li>
*/}
          <li className="nav-item hidden-md-down">
            <a className="nav-link navbar-toggler aside-menu-toggler" onClick={this.asideToggle} href="#">&#9776;</a>
          </li>
        </ul>
      </header>
    )
  }

  private toggle(e) {
    e.preventDefault()
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  private sidebarToggle(e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-hidden')
  }

  private mobileSidebarToggle(e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-mobile-show')
  }

  private asideToggle(e) {
    e.preventDefault()
    document.body.classList.toggle('aside-menu-hidden')
  }

}
