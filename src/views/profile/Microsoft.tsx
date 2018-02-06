import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import MicrosoftApi from './../../api/microsoft/MicrosoftApi'
import { NotebookStore } from './../../store/NotebookStore'
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard'
import { ImageFit } from 'office-ui-fabric-react/lib/Image'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Microsoft extends React.Component<any, any> {
  private microsoftApi: MicrosoftApi

  state = {
    displayName: '',
    principalName: '',
    photo: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob),
    contacts: []
  }

  public constructor(props) {
    super(props)
    this.microsoftApi = window["MicrosoftApi"]
  }

  public render() {
    const { displayName, principalName, photo } = this.state
    let previewProps: IDocumentCardPreviewProps = {
      previewImages: [{
          previewImageSrc: photo,
          imageFit: ImageFit.cover,
          width: 318,
          height: 196,
          accentColor: '#ce4b1f'
        }]
    }
    return (
      <div>
        <h1>Me</h1>
        <DocumentCard>
          <DocumentCardPreview { ...previewProps } />
          <DocumentCardTitle
            title = { principalName }
            shouldTruncate = { true } />
          <DocumentCardActivity
            activity='Microsoft User'
            people={
              [{ 
                name: displayName, 
                profileImageSrc: photo
              }]
            }
          />
        </DocumentCard>
        <hr/>
        <h1>My Contacts</h1>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
          {
            this.state.contacts.map( c => {
              let previewProps: IDocumentCardPreviewProps = {
                  previewImages: [{
                      name: c.emailAddresses[0].name,
                      imageFit: ImageFit.cover,
                      width: 318,
                      height: 196,
                      accentColor: '#ce4b1f'
                    }]
                }
              return (
                <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4" key={c.emailAddresses[0].address}>              
                  <DocumentCard>
{/*
                    <DocumentCardPreview { ...previewProps } />
*/}
                    <DocumentCardTitle
                      title= { c.emailAddresses[0].name }
                      shouldTruncate={ true } />
                    <DocumentCardActivity
                      activity='Azure User'
                      people={
                        [{ 
                          name: c.emailAddresses[0].address, 
                          profileImageSrc: '',
                          initials: (!!c.givenName && !!c.surname) ? c.givenName.substring(0,1) + c.surname.substring(0,1) : c.displayName.substring(0,1),
                          initialsColor: Math.floor(Math.random() * 15) + 0
                        }]
                      }
                    />
{/*
                    <DocumentCardActions
                      actions={
                        [
                          {
                            icon: 'Ringer',
                            onClick: (ev: any) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              console.log('You clicked the ringer action.');
                            },
                            ariaLabel: 'ringer action'
                          },
                        ]
                      }
                    />
 */}
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
    this.updateProfile()
  }

  private updateProfile() {
    this.microsoftApi.getMe((err, me) => {
      if (!err) {
        this.setState({
          displayName: me.displayName,
          principalName: me.userPrincipalName
        })
      }
    })
    this.microsoftApi.getContacts((err, contacts) => {
      if (!err) {
        this.setState({
          contacts: contacts
        })
      }
    })
    this.microsoftApi.getMyPicto((err, photo) => {
      if (!err) {
        const url = window.URL
        const blobPhoto = url.createObjectURL(photo)
        this.setState({
          photo: blobPhoto
        })
      }
    })
  }

}
