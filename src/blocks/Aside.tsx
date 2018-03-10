import * as React from 'react'
import * as classNames from 'classnames';
import { connect, redux } from 'react-redux'
import { NotebookStore } from './../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'
import AsideActivity from '../views/_aside/AsideActivity'
import AsideScratchpad from '../views/_aside/AsideScratchpad'
import AsideCluster from '../views/_aside/AsideCluster'

export interface AsideState { 
  activeTab: string
  messages: string[]
  refresh: boolean
}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Aside extends React.Component<any, AsideState> {

  public constructor(props) {
    super(props)
    this.state = {
      activeTab: '2',
      messages: [],
      refresh: false
    }
    this.toggle = this.toggle.bind(this)
  }

  /*
    ms-Icon ms-Icon--NoteForward
    icon-speech
    icon-list
    icon-speedometer
  */
  public render() {

    return (
      <div>
        <aside className="aside-menu">
{/*
          <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item">
                <a className={classNames({ active: this.state.activeTab === '1' }, 'nav-link')} onClick={() => { this.toggle('1'); }} data-toggle="tab" role="tab"><i className="icon-list"></i></a>
              </li>
              <li className="nav-item">
                <a className={classNames({ active: this.state.activeTab === '2' }, 'nav-link')} onClick={() => { this.toggle('2'); }} data-toggle="tab" role="tab"><i className="icon-list"></i></a>
              </li>
              <li className="nav-item">
                <a className={classNames({ active: this.state.activeTab === '3' }, 'nav-link')} onClick={() => { this.toggle('3'); }} data-toggle="tab" role="tab"><i className="icon-speedometer"></i></a>
              </li>
          </ul>
*/}
          <div className="tab-content">
              <div className={classNames({ active: this.state.activeTab === '1' }, 'tab-pane')} id="timeline" role="tabpanel">
                <AsideActivity />
              </div>
{/*
              <div className={classNames({ active: this.state.activeTab === '2' }, 'tab-pane', 'p-1')} id="messages" role="tabpanel">
*/}
              <div className={classNames({ active: this.state.activeTab === '2' }, 'tab-pane')} id="messages" role="tabpanel">
                <AsideScratchpad />
              </div>
              <div className={classNames({ active: this.state.activeTab === '3' }, 'tab-pane', 'p-1')} id="settings" role="tabpanel">
                <AsideCluster />
              </div>
          </div>
        </aside>
      </div>
    )

  }

  public componentWillReceiveProps(nextProps) {
    this.setState({
      refresh: !this.state.refresh
    })
  }

  private toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

}
