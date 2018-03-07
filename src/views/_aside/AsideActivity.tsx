import * as React from 'react'
import { NotebookStore } from './../../store/NotebookStore'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class AsideActivity extends React.Component<any, any> {

  state = {
    runningParagraphs: NotebookStore.state().runningParagraphs
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { runningParagraphs } = this.state
    return (
      <div>
{/*
        <div className="callout m-0 py-h text-muted text-center bg-faded text-uppercase">
          <small><b>Running Paragraphs</b></small>
        </div>
        {
          Object.keys(runningParagraphs).map((p) => {
            return (
              <div key={ runningParagraphs[p].id }>
                { runningParagraphs[p].id }
              </div>
            )
          })
        }
        <div className="callout m-0 py-h text-muted text-center bg-faded text-uppercase">
          <small><b>Today</b></small>
        </div>
        <hr className="transparent mx-1 my-0"/>
        <div className="callout callout-warning m-0 py-1">
            <div className="avatar float-right">
                <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
            </div>
            <div>Meeting with
                <strong>Lucas</strong>
            </div>
            <small className="text-muted mr-1"><i className="icon-calendar"></i>&nbsp; 1 - 3pm</small>
            <small className="text-muted"><i className="icon-location-pin"></i>&nbsp; Palo Alto, CA</small>
        </div>
        <hr className="mx-1 my-0"/>
        <div className="callout callout-info m-0 py-1">
            <div className="avatar float-right">
                <img src="img/avatars/4.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
            </div>
            <div>Skype with
                <strong>Megan</strong>
            </div>
            <small className="text-muted mr-1"><i className="icon-calendar"></i>&nbsp; 4 - 5pm</small>
            <small className="text-muted"><i className="icon-social-skype"></i>&nbsp; On-line</small>
        </div>
        <hr className="transparent mx-1 my-0"/>
        <div className="callout m-0 py-h text-muted text-center bg-faded text-uppercase">
            <small><b>Tomorrow</b>
            </small>
        </div>
        <hr className="transparent mx-1 my-0"/>
        <div className="callout callout-danger m-0 py-1">
            <div>New UI Project -
                <strong>deadline</strong>
            </div>
            <small className="text-muted mr-1"><i className="icon-calendar"></i>&nbsp; 10 - 11pm</small>
            <small className="text-muted"><i className="icon-home"></i>&nbsp; creativeLabs HQ</small>
            <div className="avatars-stack mt-h">
                <div className="avatar avatar-xs">
                    <img src="img/avatars/2.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/3.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/4.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/5.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/6.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
            </div>
        </div>
        <hr className="mx-1 my-0"/>
        <div className="callout callout-success m-0 py-1">
            <div>
                <strong>#10 Startups.Garden</strong>Meetup</div>
            <small className="text-muted mr-1"><i className="icon-calendar"></i>&nbsp; 1 - 3pm</small>
            <small className="text-muted"><i className="icon-location-pin"></i>&nbsp; Palo Alto, CA</small>
        </div>
        <hr className="mx-1 my-0"/>
        <div className="callout callout-primary m-0 py-1">
            <div>
                <strong>Team meeting</strong>
            </div>
            <small className="text-muted mr-1"><i className="icon-calendar"></i>&nbsp; 4 - 6pm</small>
            <small className="text-muted"><i className="icon-home"></i>&nbsp; creativeLabs HQ</small>
            <div className="avatars-stack mt-h">
                <div className="avatar avatar-xs">
                    <img src="img/avatars/2.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/3.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/4.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/5.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/6.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
                <div className="avatar avatar-xs">
                    <img src="img/avatars/8.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                </div>
            </div>
        </div>
        <hr className="mx-1 my-0"/>
*/}
{/*
        <div className="text-uppercase mb-q mt-h">
          <small><b>Disk Usage</b></small>
        </div>
        <div className="progress progress-xs">
          <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "95%" }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small className="text-muted">243GB/256GB</small>
*/}
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
{/*
        <div className="callout m-0 py-h text-muted text-center bg-faded text-uppercase">
          <small><b>Received Messages</b></small>
        </div>
        {
          this.state.spitfireMessages.map((w) => {
            return (
              <small key={ Math.random() } className="text-muted">
                { JSON.stringify(w) }
                <br/>
              </small>
            )
          })
        }
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr/>
        <div className="message">
            <div className="py-1 pb-3 mr-1 float-left">
                <div className="avatar">
                    <img src="img/avatars/7.jpg" className="img-avatar" alt="admin@bootstrapmaster.com"></img>
                    <span className="avatar-status badge-success"></span>
                </div>
            </div>
            <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-q">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
*/}
        </div>
    )
  }

}
