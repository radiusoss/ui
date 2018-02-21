import * as React from 'react'
import { connect } from 'react-redux'
import { NotebookStore } from './../../store/NotebookStore'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import TwitterApi from './../../api/twitter/TwitterApi'
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard'
import { ImageFit } from 'office-ui-fabric-react/lib/Image'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class TwitterProfile extends React.Component<any, any> {
  private twitterApi: TwitterApi

  state = {
    me: NotebookStore.state().me,
    profileDisplayName: NotebookStore.state().profileDisplayName,
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob),
    contacts: []
  }

  public constructor(props) {
    super(props)
    this.twitterApi = window["TwitterApi"]
  }

  public render() {
    const { profileDisplayName, profilePhoto, me } = this.state
    var previewProps: IDocumentCardPreviewProps = {
      previewImages: [{
//      previewImageSrc: me.profile_background_image_url_https,
        previewImageSrc: me.profile_banner_url,
        imageFit: ImageFit.cover,
        width: 318,
        height: 196,
        accentColor: '#' + me.profile_sidebar_fill_color
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
            activity={'@' + this.state.me.screen_name}
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
