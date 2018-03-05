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
import { DetailsList, DetailsListLayoutMode, Selection, IColumn} from 'office-ui-fabric-react/lib/DetailsList'
import { lorem } from '../../spl/DataSpl'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class GoogleProfileWidget extends React.Component<any, any> {

  state = {
    me: NotebookStore.state().me,
    profileDisplayName: NotebookStore.state().profileDisplayName,
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob)
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    var { profileDisplayName, profilePhoto, me } = this.state
    var previewProps: IDocumentCardPreviewProps = {
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
