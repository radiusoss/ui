import * as React from 'react'
import { toastr } from 'react-redux-toastr'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import NotebookApi from './../../api/notebook/NotebookApi'
import NoteResults from './NoteResults'
import { connect } from 'react-redux'
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating'
import { Facepile, IFacepilePersona, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile'
import { PersonaSize, PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona'
import { TestImages, facepilePersonas, ExtraDataType } from './../../spl/ImageSpl'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteCover extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    note: {
      id: '',
      name: '',
      paragraphs: []
    },
    showPanel: true,
    numberOfFaces: 3,
    imagesFadeIn: true,
    extraDataType: ExtraDataType.none,
    personaSize: PersonaSize.extraSmall
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window['NotebookApi']
  }

  public render() {
    const { note, showPanel } = this.state
    return (
      <div>
      {(showPanel == true) ?
        <Panel
          isOpen={ this.state.showPanel }
          type={ PanelType.smallFluid }
          onDismiss={ () => this.notebookApi.showNoteLayout(this.state.note.id, 'workbench') }
          headerText={note.name + ' - ' + new Date()}
        >
{/*
          <Facepile
            personaSize={PersonaSize.small}
            personas={facepilePersonas.slice(0, this.state.numberOfFaces)}
//            getPersonaProps={
//              imageShouldFadeIn: {this.state.imagesFadeIn}
//              hidePersonaDetails={false}
//            }
          />
          <Rating
            min={ 1 }
            max={ 5 }
            rating={ 4 }
            onChanged={ rating => toastr.warning('Not yet available', 'Looks like you are eager for the next release to give rating ' + rating) }
            onFocus={ () => console.log('onFocus called') }
            onBlur={ () => console.log('onBlur called') }
          />
*/}
          <div className="ms-Grid">
            <div className="ms-Grid-row">
              <div className={`${styles.rendererHeight} ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px'}} >
                <NoteResults note={note} showControlBar={false} showGraphBar={false} showParagraphTitle={true} />
              </div>
            </div>
          </div>
        </Panel>
        :
        <div className="ms-Grid">
          <div className="ms-Grid-row">
           <div className={`${styles.rendererHeight} ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px' }} >
             <NoteResults note={note} showControlBar={true} showGraphBar={true} showParagraphTitle={true} />
           </div>
          </div>
        </div>
      }
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { spitfireMessageReceived } = nextProps
    if (! spitfireMessageReceived) return
    if (spitfireMessageReceived.op == "NOTE") {
      this.setState({
        note: spitfireMessageReceived.data.note
      })
    }
  }

}
