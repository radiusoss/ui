import * as React from 'react'
import * as classNames from 'classnames';
import { connect, redux } from 'react-redux'
import { NotebookStore } from './../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'
import Aside1 from '../views/_aside/Aside1'
import Aside2 from '../views/_aside/Aside2'
import Aside3 from '../views/_aside/Aside3'

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
      activeTab: '1',
      messages: [],
      refresh: false
    }

    this.toggle = this.toggle.bind(this)

  }

  public render() {

    return (

      <div>

        <aside className="aside-menu">
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a className={classNames({ active: this.state.activeTab === '1' }, 'nav-link')} onClick={() => { this.toggle('1'); }} data-toggle="tab" role="tab"><i className="icon-list"></i></a>
                </li>
                <li className="nav-item">
                    <a className={classNames({ active: this.state.activeTab === '2' }, 'nav-link')} onClick={() => { this.toggle('2'); }} data-toggle="tab" role="tab"><i className="icon-speech"></i></a>
                </li>
                <li className="nav-item">
                    <a className={classNames({ active: this.state.activeTab === '3' }, 'nav-link')} onClick={() => { this.toggle('3'); }} data-toggle="tab" role="tab"><i className="icon-settings"></i></a>
                </li>
            </ul>
            <div className="tab-content">
                <div className={classNames({ active: this.state.activeTab === '1' }, 'tab-pane')} id="timeline" role="tabpanel">
                  <Aside1 />
                </div>
                <div className={classNames({ active: this.state.activeTab === '2' }, 'tab-pane', 'p-1')} id="messages" role="tabpanel">
                  <Aside2 />
                </div>
                <div className={classNames({ active: this.state.activeTab === '3' }, 'tab-pane', 'p-1')} id="settings" role="tabpanel">
                    <Aside3 />
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
