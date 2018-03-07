import * as React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { NotebookStore } from './../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import { toastr } from 'react-redux-toastr'
import { IUser } from './../../domain/Domain'
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard'
import { ImageFit } from 'office-ui-fabric-react/lib/Image'
import { EADDRINUSE } from 'constants';

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NotePermissions extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    note: {
      id: ''
    },
    users: [],
    permissions: new Map<string, string>()
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.state = {
      note: props.permNote,
      users: [],
      permissions: new Map<string, string>()
    }
  }

  public render() {
    return (      
      <div>
        <div className="ms-Grid" style={{ padding: 0}}>
          <div className="ms-Grid-row">
            {
              this.state.users.map((user) => {
                return (
                  <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" key={ user.principal }>
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
                          [this.getActionButton(user)]
                        }
                      />
                    </DocumentCard>
                    <br/>
                    <Toggle
                      checked={ this.hasAccess(user) }
                      onText={ user.displayName + ' has access.'}
                      offText={ user.displayName + ' does not have access.'}
                      onChanged={ (checked: boolean) => this.togglePermissions(user) }
                      />
                    <hr/>
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
    const { spitfireMessageReceived } = nextProps
    if (! spitfireMessageReceived) return
    if (spitfireMessageReceived.op == "LIST_USERS") {
      var users = spitfireMessageReceived.data.users
      this.notebookApi.getNotePermissions(this.state.note.id).then(resp => {
        var arr = resp.result.body
        this.setState({
          permissions: new Map<string, string>(arr.owners.map((i) => [i, i]))
        })
      })
      this.setState({
        users: Object.keys(users).map(function(k) { return users[k] })
      })
    }
  }

  private hasAccess(user) {
    if (this.state.permissions.get(user.email + "#" + user.source)) {
      return true
    }
    return false
  }

  private getActionButton(user) {
    if (this.state.permissions.get(user.email + "#" + user.source)) {
      return {
        iconProps: { iconName: 'Permissions' },
        title: 'Remove Permissions from ' + user.displayName,
        onClick: (ev: any) => {
          ev.preventDefault()
          ev.stopPropagation()
          this.togglePermissions(user)
        }
      }
    }
    return {
      iconProps: { iconName: 'PermissionsSolid' },
      title: 'Give Permissions to ' + user.displayName,
      onClick: (ev: any) => {
        ev.preventDefault()
        ev.stopPropagation()
        this.togglePermissions(user)
      }
    }
  }

  private togglePermissions(user: any) {
    var permissions = this.state.permissions
    var perm = this.state.permissions.get(user.email + "#" + user.source)
    if (perm) {
      permissions.delete(user.email + "#" + user.source)
      toastr.info("Permission", user.displayName + ' access has been removed.')
    }
    else {
      permissions.set(user.email + "#" + user.source, user.email + "#" + user.source)
      toastr.info("Permission", user.displayName + ' has been given access to this note.')
    }
    var permsArr = Array.from(permissions.keys())
    var perms = {
      readers: permsArr,
      owners: permsArr,
      writers: permsArr,
      runners: permsArr
    }
    this.notebookApi.putNotePermissions(this.state.note.id, perms)
    this.setState({
      permissions: permissions
    })
  }

}
