import * as React from 'react'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import { NotebookStore } from './../../store/NotebookStore'
import Kerberos from './Kerberos'
import Microsoft from './Microsoft'
import Twitter from './Twitter'
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
    isMicrosoftAuthenticated: NotebookStore.state().isMicrosoftAuthenticated,
    isTwitterAuthenticated: NotebookStore.state().isTwitterAuthenticated
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { isMicrosoftAuthenticated, isTwitterAuthenticated } = this.state
    return (
      <div>
        <Pivot>
          <PivotItem linkText='Microsoft' itemIcon='OfficeLogo'>
            { (isMicrosoftAuthenticated) &&
              <Microsoft />
            }
            { (! isMicrosoftAuthenticated) &&
            <MessageBar
              messageBarType={ MessageBarType.info }
              isMultiline={ false }
            >
              Nothing to see here...
              </MessageBar>
            }
          </PivotItem>
          <PivotItem linkText='Twitter' itemIcon='SocialListeningLogo'>
          { (isTwitterAuthenticated) &&
              <Twitter/>
            }
            { (! isTwitterAuthenticated) &&
            <MessageBar
              messageBarType={ MessageBarType.info }
              isMultiline={ false }
            >
              Nothing to see here...
            </MessageBar>
            }
          </PivotItem>
        </Pivot>
{/*
          <PivotItem linkText='Kerberos' itemIcon='SecurityGroup'>
            <Kerberos />
          </PivotItem>
*/}
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { isMicrosoftAuthenticated, isTwitterAuthenticated, profileDisplayName, profilePhoto } = nextProps
    this.setState({
      isMicrosoftAuthenticated: isMicrosoftAuthenticated, 
      isTwitterAuthenticated: isTwitterAuthenticated
    })
  }

}
