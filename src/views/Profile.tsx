import * as React from 'react'
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { PivotItem, IPivotItemProps, Pivot} from 'office-ui-fabric-react/lib/Pivot'
import { NotebookStore } from './../store/NotebookStore'
import Kerberos from './profile/Kerberos'
import Microsoft from './profile/Microsoft'
import Twitter from './profile/Twitter'
import { connect } from 'react-redux'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class Profile extends React.Component<any, any> {

  state = {
    isMicrosoftAuthenticated: false,
    isTwitterAuthenticated: false,
    profileDisplayName: '',
    profilePhoto: null
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { isMicrosoftAuthenticated, isTwitterAuthenticated } = this.state
    return (
      <div>
        <Pivot>
{/*
          if (isMicrosoftAuthenticated) {
            <PivotItem linkText='Microsoft' itemIcon='OfficeLogo'>
              <Microsoft />
            </PivotItem>
          }
*/}
          if (isTwitterAuthenticated) {
            <PivotItem linkText='Twitter' itemIcon='SocialListeningLogo'>
              <Twitter/>
            </PivotItem>
          }
{/*
          <PivotItem linkText='Kerberos' itemIcon='SecurityGroup'>
            <Kerberos />
          </PivotItem>
*/}
        </Pivot>
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { isMicrosoftAuthenticated, isTwitterAuthenticated, profileDisplayName, profilePhoto } = nextProps
    this.setState({
      isMicrosoftAuthenticated: isMicrosoftAuthenticated, 
      isTwitterAuthenticated: isTwitterAuthenticated, 
      profileDisplayName: profileDisplayName, 
      profilePhoto: profilePhoto
    })
  }

}
