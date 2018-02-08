import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import { IUser } from './../../domain/Domain'
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard'
import { ImageFit } from 'office-ui-fabric-react/lib/Image'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Users extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    users: []
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    return (      
      <div>
        <div className='ms-font-su'>Users</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            {
              this.state.users.map((c) => {
                return (
                  <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2" key={ c.principal }>
                    <DocumentCard>
                      <DocumentCardTitle
                        title = { c.displayName }
                        shouldTruncate = { true } />
                      <DocumentCardActivity
                        activity={'@' + c.principal}
                        people={
                          [{ 
                            name: c.email, 
                            profileImageSrc: c.picto
                          }]
                        }
                      />
                      <DocumentCardActions
                        actions={
                          [
                            {
                              iconProps: { iconName: 'Delete' },
                              onClick: (ev: any) => {
                                this.deleteUser(c)
                                ev.preventDefault()
                                ev.stopPropagation()
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
      principal: user.principal + '#' + user.source
    })
  }

}
