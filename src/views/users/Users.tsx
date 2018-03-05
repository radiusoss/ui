import * as React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { NotebookStore } from './../../store/NotebookStore'
import { IUser } from './../../domain/Domain'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard'
import { ImageFit } from 'office-ui-fabric-react/lib/Image'
import GoogleUsers from './GoogleUsers'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Users extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    users: [],
    isGoogleAuthenticated: NotebookStore.state().isGoogleAuthenticated,
    isMicrosoftAuthenticated: NotebookStore.state().isMicrosoftAuthenticated,
    isTwitterAuthenticated: NotebookStore.state().isTwitterAuthenticated
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { isGoogleAuthenticated, isMicrosoftAuthenticated, isTwitterAuthenticated } = this.state
    return (      
      <div>
        <div>
          <div style={{float: "left"}}>
            <Icon iconName='People' className='ms-Icon50' />
          </div>
          <div style={{float: "left"}}>
            <div className='ms-font-su'>Users</div>
          </div>
        </div>
        <div className="ms-clearfix"/>
        <div className="ms-Grid" style={{ padding: 0}}>
          <div className="ms-Grid-row">
            {
              this.state.users.map((user) => {
                return (
                  <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2" key={ user.principal }>
                    <DocumentCard>
                      <DocumentCardTitle
                        title = { user.displayName }
                        shouldTruncate = { true } />
                      <DocumentCardActivity
                        activity={'@' + user.principal}
                        people={
                          [{ 
                            name: user.email, 
                            profileImageSrc: user.picto
                          }]
                        }
                      />
                      <DocumentCardActions
                        actions={
                          [
                            {
                              iconProps: { iconName: 'Delete' },
                              onClick: (ev: any) => {
                                ev.preventDefault()
                                ev.stopPropagation()
                                this.deleteUser(user)
                              }
                            }
                          ]
                        }
                      />
                    </DocumentCard>
                  </div>
                )
              })
            }
          </div>
          <hr/>
          { (isGoogleAuthenticated) && <GoogleUsers/> }
{/*
          { (isMicrosoftAuthenticated) && <MicrosoftUsers/> }
          { (isTwitterAuthenticated) && <TwitterUsers/> }
*/}
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.notebookApi.listUsers()
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "LIST_USERS") {
      var users = webSocketMessageReceived.data.users
      this.setState({
        users: Object.keys(users).map(function(k) { return users[k] })
      })
    }
  }

  private deleteUser(user: any) {
    this.notebookApi.removeUsers({
      principal: user.userName + '#' + user.source
    })
  }

}
