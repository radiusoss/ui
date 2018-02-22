import * as React from 'react'
import { connect, redux } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class AsideActivity extends React.Component<any, any> {

  public constructor(props) {
    super(props)
  }

  public render() {
    var paragraphs = NotebookStore.state().runningParagraphs
    return (    
      <div>
        <div className="callout m-0 py-h text-muted text-center bg-faded text-uppercase">
          <small><b>Running Paragraphs</b></small>
        </div>
        {
          Object.keys(paragraphs).map((p) => {
            return (
                <div key={ paragraphs[p] + Math.random() }>
                    { paragraphs[p].id }
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
      </div>
    )
  }

}
