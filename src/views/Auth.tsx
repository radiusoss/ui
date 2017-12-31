import * as React from 'react'
import { connect } from 'react-redux'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'
import AadApi from './../api/microsoft/AadApi'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import PeoplePickerExample from './../components/PeoplePicker'
import DetailsList from './../components/DetailsList'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class Auth extends React.Component<AuthDispatchers & AuthProps, any> {

  public constructor(props) {
    super(props)
    this.state = {
      example: '',
      displayName: ''
    }
  }

  public render() {

    return (

      <div >

        <div>
        {          
          // Show the command bar with the Sign in or Sign out button.
          <CommandBar
            items={[
              {
                key: 'component-example-menu',
                name: 'Choose component',
                disabled: !this.props.isAadAuthenticated,
                ariaLabel: 'Choose a component example to render in the page',
                items: [
                  {
                    key: 'people-picker-example',
                    name: 'People Picker',
                    onClick: () => { this.setState({ example: 'people-picker-example' }) }
                  },
                  {
                    key: 'details-list-example',
                    name: 'Details List',
                    onClick: () => { this.setState({ example: 'details-list-example' }) }
                  }
                ]
              }  
            ]}
            farItems={[
              {
                key: 'display-name',
                name: this.state.displayName
              },
              {
                key: 'log-in-out=button',
                name: this.props.isAadAuthenticated ? 'Sign out' : 'Sign in',
                onClick: this.props.isAadAuthenticated ? this.logout.bind(this) : this.login.bind(this)
              }
            ]} />
        }
        </div>
        <div className="ms-font-m">
          <div>
            <h2>Microsoft Graph Office UI Fabric React Sample</h2>
            {
              (!this.props.isAadAuthenticated || this.state.example === '') &&
              <div>
                <p>This sample shows how you can use Microsoft Graph data in Office UI Fabric React components.</p>
                <p>To get started, sign in and then choose a component example in the command bar.</p>
              </div>
            }
          </div>
          <br />
          {
            this.props.isAadAuthenticated &&
              <div>
              {
                this.state.example === 'people-picker-example' &&
                <PeoplePickerExample />
              }
              {
                this.state.example === 'details-list-example' &&
                <DetailsList />
              }
              </div>
          }
        </div>
      </div>

    )

  }
  
  // Get the user's display name.
  public componentWillMount() {
    if (this.props.isAadAuthenticated) {
/*      
      this.aadApi.getMe((err, me) => {
        if (!err) {
          this.setState({
            displayName: `Hello ${me.displayName}!`
          });
        }
      })
*/
    }
  }

  private login() { 
    this.props.dispatchToAadAction()
  }

  private logout() { 
    this.props.dispatchLogoutAction()
    this.setState({ 
      example: '',
      displayName: ''
    })
  }

}
