import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import GoogleApi from './../../api/google/GoogleApi'
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard'
import { ImageFit } from 'office-ui-fabric-react/lib/Image'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Google extends React.Component<any, any> {
  private googleApi: GoogleApi

  state = {
    me: NotebookStore.state().me,
    profileDisplayName: NotebookStore.state().profileDisplayName,
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob),
    contacts: []
  }

  public constructor(props) {
    super(props)
    this.googleApi = window["GoogleApi"]
  }

  public render() {
    const { profileDisplayName, profilePhoto, me } = this.state
    let previewProps: IDocumentCardPreviewProps = {
      previewImages: [{
        previewImageSrc: me.coverPhotos[0].url,
        imageFit: ImageFit.cover,
        width: 318,
        height: 196
      }]
    }
    return (
      <div>
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
      </div>
    )
  }

}
