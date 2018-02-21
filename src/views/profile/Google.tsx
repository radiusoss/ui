import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { toastr } from 'react-redux-toastr'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import GoogleApi from './../../api/google/GoogleApi'
import NotebookApi from './../../api/notebook/NotebookApi'
import { IUser } from './../../domain/Domain'
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard'
import { ImageFit } from 'office-ui-fabric-react/lib/Image'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import { DetailsList, DetailsListLayoutMode, Selection, IColumn} from 'office-ui-fabric-react/lib/DetailsList'
import { lorem } from '../../spl/DataSpl'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

var googleContacts: IUser[] = []

export interface IGoogleProfileState {
  me: any;
  profileDisplayName: string;
  profilePhoto: string;
  contacts: any[];
  columns: IColumn[];
  items: IUser[];
  selectionDetails: JSX.Element;
  isModalSelection: boolean;
  isCompactMode: boolean;
}

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Picto',
    headerClassName: 'DetailsListExample-header--FileIcon',
    className: 'DetailsListExample-cell--FileIcon',
    iconClassName: 'DetailsListExample-Header-FileTypeIcon',
    iconName: 'Page',
    isIconOnly: true,
    fieldName: 'picto',
    minWidth: 48,
    maxWidth: 48,
    onRender: (item: IUser) => {
      return (
        <img src={ item.picto } height="48px" />
      )
    }
  },
  {
    key: 'column2',
    name: 'Display Name',
    fieldName: 'displayName',
    minWidth: 210,
    maxWidth: 350,
    isRowHeader: true,
    isResizable: true,
    isSorted: true,
    isSortedDescending: false,
    onColumnClick: this.onColumnClick,
    data: 'string',
    isPadded: true
  },
  {
    key: 'column3',
    name: 'Email',
    fieldName: 'email',
    minWidth: 210,
    maxWidth: 350,
    isRowHeader: true,
    isResizable: true,
    isSorted: true,
    isSortedDescending: false,
    onColumnClick: this.onColumnClick,
    data: 'string',
    isPadded: true
  },
  {
    key: 'column4',
    name: '',
    fieldName: 'principal',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    data: 'number',
    onColumnClick: this.onColumnClick,
    onRender: (item: IUser) => {
      return (
        <span>{ item.principal }</span>
      )
    }
  }
]

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Google extends React.Component<any, IGoogleProfileState> {
  private googleApi: GoogleApi
  private notebookApi: NotebookApi
  private selection: Selection = new Selection({
    onSelectionChanged: () => {
      this.setState({
        selectionDetails: this.getSelectionDetails(),
        isModalSelection: this.selection.isModal()
      })
    }
  })

  state = {
    me: NotebookStore.state().me,
    profileDisplayName: NotebookStore.state().profileDisplayName,
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob),
    contacts: [],
    items: googleContacts,
    columns: null,
    selectionDetails: null,
    isModalSelection: false,
    isCompactMode: false
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.googleApi = window["GoogleApi"]
  }

  public render() {
    var { columns, isCompactMode, items, selectionDetails, profileDisplayName, profilePhoto, me } = this.state
    var previewProps: IDocumentCardPreviewProps = {
      previewImages: [{
        previewImageSrc: me.coverPhotos[0].url,
        imageFit: ImageFit.cover,
        width: 318,
        height: 196
      }]
    }
    return (
      <div className={`${styles.homeHeight}`} style={{overflowY: 'scroll'}}>
        <div className='ms-font-su'>{ profileDisplayName }</div>
        <DocumentCard>
          <DocumentCardPreview { ...previewProps } />
          <DocumentCardTitle
            title = { profileDisplayName }
            shouldTruncate = { true } />
          <DocumentCardActivity
            activity={'@' + this.state.me.resourceName}
            people={
              [{ 
                name: profileDisplayName, 
                profileImageSrc: profilePhoto
              }]
            }
          />
        </DocumentCard>
        <hr/>
        <div className='ms-font-xxl'>Contacts</div>
{/*
        <Toggle
          label='Enable Compact Mode'
          checked={ isCompactMode }
          onChanged={ this.onChangeCompactMode }
          onText='Compact'
          offText='Normal'
        />
        <Toggle
          label='Enable Modal Selection'
          checked={ this.state.isModalSelection }
          onChanged={ this.onChangeModalSelection }
          onText='Modal'
          offText='Normal'
        />
*/}
        <div>{ selectionDetails }</div>
        <TextField
          label='Filter by name:'
          onChanged={ this.onChangeText }
        />
        <MarqueeSelection selection={ this.selection }>
          <DetailsList
            items={ items }
            compact={ isCompactMode }
            columns={ columns }
            setKey='set'
            layoutMode={ DetailsListLayoutMode.justified }
            isHeaderVisible={ true }
            selection={ this.selection }
            selectionPreservedOnEmptyClick={ true }
            onItemInvoked={ this.onItemInvoked }
            enterModalSelectionOnTouch={ true }
          />
        </MarqueeSelection>
      </div>
    )
  }

  public componentDidMount() {
    this.setState({
      items: googleContacts,
      columns: columns,
      selectionDetails: this.getSelectionDetails(),
      isModalSelection: this.selection.isModal(),
    })
  this.updateContacts()
  }

  private updateContacts() {
    this.googleApi.getContacts(2000)
      .then(contacts => {
        var connections = contacts.result.connections
        if (connections.length != 0) {
          googleContacts = []
          connections.map( c => {
            var resourceName = c.resourceName
            var userName = resourceName
            var displayName = ""
            if (c.names && c.names[0]) displayName = c.names[0].displayName
            var email = ""
            if (c.emailAddresses && c.emailAddresses[0]) {              
              email = c.emailAddresses[0].value
              userName = email
            }
            var picto = ""
            if (c.photos && c.photos[0]) picto = c.photos[0].url
            googleContacts.push({
              displayName: displayName,
              email: email,
              userName: userName,
              source: "google",
              principal: resourceName,
              picto: picto
            })
          })
        }
        googleContacts = this.sortItems(googleContacts, 'displayName');    
        this.setState({
          contacts: connections,
          items: googleContacts
        })
    })
  }

  public componentDidUpdate(previousProps: any, previousState: IGoogleProfileState) {
    if (previousState.isModalSelection !== this.state.isModalSelection) {
      this.selection.setModal(this.state.isModalSelection)
    }
  }

  @autobind
  private onChangeCompactMode(checked: boolean): void {
    this.setState({ isCompactMode: checked })
  }

  @autobind
  private onChangeModalSelection(checked: boolean): void {
    this.setState({ isModalSelection: checked })
  }

  @autobind
  private onChangeText(text: any): void {
    this.setState({ items: text ? googleContacts.filter(i => i.displayName.toLowerCase().indexOf(text) > -1) : googleContacts })
  }

  private onItemInvoked(item: any): void {
//    alert(`Item invoked: ${item.displayName}`)
  }

  private getSelectionDetails(): JSX.Element {
    var selectionCount = this.selection.getSelectedCount()
    switch (selectionCount) {
      case 0:
        return <DefaultButton
          primary={ true }
          disabled={ true }
          text='No contact selected'
          onClick={ () => this.addUsers(this.selection.getSelection()) }
        />
      case 1:
        return <DefaultButton
          primary={ true }
          disabled={ false }
          text={`Add ${(this.selection.getSelection()[0] as any).displayName} as User.`}
          onClick={ () => this.addUsers(this.selection.getSelection()) }
        />
      default:
        return <DefaultButton
          primary={ true }
          disabled={ false }
          text={`Add the ${selectionCount} selected contacts as Users.`}
          onClick={ () => this.addUsers(this.selection.getSelection()) }
        />
    }
  }

  private addUsers(users: any[]) {
    var usersMap = {}
    users.map((u) => {
      usersMap[u.email + "#google"] = u
    })
    this.notebookApi.addUsers(usersMap)
    toastr.success('Users', 'Just added ' + users.length + ' user(s).')
  }

  @autobind
  private onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
    const { columns, items } = this.state;
    var newItems: IUser[] = items.slice();
    var newColumns: IColumn[] = columns.slice();
    var currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
      return column.key === currCol.key
    })[0]
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true
      }
    })
    newItems = this.sortItems(newItems, currColumn.fieldName, currColumn.isSortedDescending)
    this.setState({
      columns: newColumns,
      items: newItems
    })
  }

  @autobind
  private sortItems(items: IUser[], sortBy: string, descending = false): IUser[] {
    if (descending) {
      return items.sort((a: IUser, b: IUser) => {
        if (a[sortBy] < b[sortBy]) {
          return 1
        }
        if (a[sortBy] > b[sortBy]) {
          return -1
        }
        return 0
      })
    } else {
      return items.sort((a: IUser, b: IUser) => {
        if (a[sortBy] < b[sortBy]) {
          return -1
        }
        if (a[sortBy] > b[sortBy]) {
          return 1
        }
        return 0
      })
    }
  }

}
