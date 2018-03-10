import * as React from 'react'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import { NotebookStore } from './../../store/NotebookStore'
import KerberosProfile from './KerberosProfile'
import MicrosoftProfile from './MicrosoftProfile'
import GoogleProfile from './GoogleProfile'
import { connect } from 'react-redux'
import { MessageBarButton } from 'office-ui-fabric-react/lib/Button'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class Profile extends React.Component<any, any> {

  state = {
    isGoogleAuthenticated: NotebookStore.state().isGoogleAuthenticated,
    isMicrosoftAuthenticated: NotebookStore.state().isMicrosoftAuthenticated,
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { isGoogleAuthenticated, isMicrosoftAuthenticated } = this.state
/*
    var selectedKey = 'google'
    if (isMicrosoftAuthenticated) selectedKey = 'microsoft'
    if (isTwitterAuthenticated) selectedKey = 'twitter'
*/
    return (
      <div>
        { (isGoogleAuthenticated) &&  <GoogleProfile/> }
        { (isMicrosoftAuthenticated) && <MicrosoftProfile/> }
{/*
        <Pivot selectedKey={ selectedKey }>
          <PivotItem linkText='Google' itemIcon='SocialListeningLogo' itemKey='google'>
            { (isGoogleAuthenticated) &&
                <Google/>
              }
              { (! isGoogleAuthenticated) &&
              <div style={{ padding: 10 }}>
                <MessageBar
                  messageBarType={ MessageBarType.info }
                  isMultiline={ false }
                >
                  Nothing to see here...
                </MessageBar>
              </div>
              }
          </PivotItem>
          <PivotItem linkText='Microsoft' itemIcon='OfficeLogo' itemKey='microsoft'>
            { (isMicrosoftAuthenticated) &&
              <Microsoft />
            }
            { (! isMicrosoftAuthenticated) &&
            <div style={{ padding: 10 }}>
              <MessageBar
                messageBarType={ MessageBarType.info }
                isMultiline={ false }
              >
                Nothing to see here...
                </MessageBar>
            </div>
            }
          </PivotItem>
          <PivotItem linkText='Twitter' itemIcon='SocialListeningLogo' itemKey='twitter'>
          { (isTwitterAuthenticated) &&
              <Twitter/>
            }
            { (! isTwitterAuthenticated) &&
            <div style={{ padding: 10 }}>
              <MessageBar
                messageBarType={ MessageBarType.info }
                isMultiline={ false }
              >
                Nothing to see here...
              </MessageBar>
            </div>
            }
          </PivotItem>
        </Pivot>
*/}
{/*
          <PivotItem linkText='Kerberos' itemIcon='SecurityGroup'>
            <Kerberos />
          </PivotItem>
*/}
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { isMicrosoftAuthenticated, profileDisplayName, profilePhoto } = nextProps
    this.setState({
      isMicrosoftAuthenticated: isMicrosoftAuthenticated, 
    })
  }

}
