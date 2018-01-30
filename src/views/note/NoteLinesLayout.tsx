import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating'
import ParagraphEditor from './editor/paragraph/ParagraphEditor'
import ParagraphResultsRenderer from './renderer/paragraph/ParagraphResultsRenderer'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { toastr } from 'react-redux-toastr'
import { goToTop } from 'react-scrollable-anchor'
import { Facepile, IFacepilePersona, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile'
import { PersonaSize, PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

const baseProductionCdnUrl = 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/';

export const TestImages = {
  choiceGroupBarUnselected: baseProductionCdnUrl + 'choicegroup-bar-unselected.png',
  choiceGroupBarSelected: baseProductionCdnUrl + 'choicegroup-bar-selected.png',
  choiceGroupPieUnselected: baseProductionCdnUrl + 'choicegroup-pie-unselected.png',
  choiceGroupPieSelected: baseProductionCdnUrl + 'choicegroup-pie-selected.png',
  documentPreview: baseProductionCdnUrl + 'document-preview.png',
  documentPreviewTwo: baseProductionCdnUrl + 'document-preview2.png',
  documentPreviewThree: baseProductionCdnUrl + 'document-preview3.png',
  iconOne: baseProductionCdnUrl + 'icon-one.png',
  iconPpt: baseProductionCdnUrl + 'icon-ppt.png',
  personaFemale: baseProductionCdnUrl + 'persona-female.png',
  personaMale: baseProductionCdnUrl + 'persona-male.png'
}

export const facepilePersonas: IFacepilePersona[] = [
  {
    imageUrl: TestImages.personaFemale,
    personaName: 'Annie Lindqvist',
    data: '50%'
  },
  {
    imageUrl: TestImages.personaMale,
    personaName: 'Aaron Reid',
    data: '$1,000'
  },
  {
    personaName: 'Alex Lundberg',
    data: '75%',
    onClick: (ev: React.MouseEvent<HTMLElement>, persona: IFacepilePersona) =>
      alert('You clicked on ' + persona.personaName + '. Extra data: ' + persona.data)
  },
  {
    personaName: 'Roko Kolar',
    data: '4 hrs'
  },
  {
    imageInitials: 'CB',
    personaName: 'Christian Bergqvist',
    initialsColor: PersonaInitialsColor.green,
    data: '25%'
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'VL',
    personaName: 'Valentina Lovric',
    initialsColor: PersonaInitialsColor.lightBlue,
    data: 'Emp1234',
    onClick: (ev: React.MouseEvent<HTMLElement>, persona: IFacepilePersona) =>
      alert('You clicked on ' + persona.personaName + '. Extra data: ' + persona.data)
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'MS',
    personaName: 'Maor Sharett',
    initialsColor: PersonaInitialsColor.lightGreen
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'PV',
    personaName: 'Annie Lindqvist2',
    initialsColor: PersonaInitialsColor.lightPink
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'AR',
    personaName: 'Aaron Reid2',
    initialsColor: PersonaInitialsColor.magenta,
    data: 'Emp1234',
    onClick: (ev: React.MouseEvent<HTMLElement>, persona: IFacepilePersona) =>
      toastr.warning('You clicked on ' + persona.personaName + '. Extra data: ' + persona.data)
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'AL',
    personaName: 'Alex Lundberg2',
    initialsColor: PersonaInitialsColor.orange
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'RK',
    personaName: 'Roko Kolar2',
    initialsColor: PersonaInitialsColor.pink
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'CB',
    personaName: 'Christian Bergqvist2',
    initialsColor: PersonaInitialsColor.purple
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'VL',
    personaName: 'Valentina Lovric2',
    initialsColor: PersonaInitialsColor.red
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'MS',
    personaName: 'Maor Sharett2',
    initialsColor: PersonaInitialsColor.teal
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'VL',
    personaName: 'Another A Name',
    initialsColor: PersonaInitialsColor.blue
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'MS',
    personaName: 'Another A Name (So Many A names!)',
    initialsColor: PersonaInitialsColor.darkBlue
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'VL',
    personaName: 'Another Anecdotal A Name',
    initialsColor: PersonaInitialsColor.darkGreen
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'MS',
    personaName: 'Anerobic A Name',
    initialsColor: PersonaInitialsColor.darkRed
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'VL',
    personaName: 'Aerobic A Name',
    initialsColor: PersonaInitialsColor.green
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'MS',
    personaName: 'Maor Sharett2',
    initialsColor: PersonaInitialsColor.lightBlue
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'VL',
    personaName: 'Valentina Lovric2',
    initialsColor: PersonaInitialsColor.lightGreen
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'MS',
    personaName: 'Maor Sharett2',
    initialsColor: PersonaInitialsColor.lightPink
  },
  {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'VL',
    personaName: 'Valentina Lovric2',
    initialsColor: PersonaInitialsColor.magenta
  },
  {
    imageUrl: TestImages.personaMale,
    imageInitials: 'MS',
    personaName: 'Maor Sharett2',
    initialsColor: PersonaInitialsColor.orange
  },
]

export enum ExtraDataType {
  none = 0,
  name = 1
}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteLinesLayout extends React.Component<any, any> {

  state = {
    note: {
      id: '',
      name: '',
      paragraphs: []
    },
    numberOfFaces: 3,
    imagesFadeIn: true,
    extraDataType: ExtraDataType.none,
    personaSize: PersonaSize.extraSmall
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { note } = this.state
    if (note.id) {
      var i = 0
      return (
        <div style={{ backgroundColor: "white"}}>
          <div className="ms-Grid">
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 ms-textAlignCenter">
                <div className="ms-font-xxl">{note.name}</div>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-textAlignRight">
                <Rating
                  min={ 1 }
                  max={ 5 }
                  rating={ 4 }
                  onChanged={ rating => toastr.warning('Not yet available', 'Looks like you are eager for the new version to give rating ' + rating) }
                  onFocus={ () => console.log('onFocus called') }
                  onBlur={ () => console.log('onBlur called') }
                />
              </div>
              <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-textAlignLeft">
                <Facepile
                  personaSize={PersonaSize.small}
                  personas={facepilePersonas.slice(0, this.state.numberOfFaces)}
  /*
                  getPersonaProps={
                    imageShouldFadeIn: {this.state.imagesFadeIn}
                    hidePersonaDetails={false}
                  }
  */
                />
              </div>
            </div>
          </div>
          {
            note.paragraphs.map(p => {
              i++
              return (
                <div>
                  <div className="ms-Grid" key={note.id + '-' + p.id}>
                    <div className="ms-Grid-row">
                      <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px' }}>
                        <ParagraphEditor note={note} paragraph={p} key={note.id + '-pe-' + p.id} focus={i==1}/>
                      </div>
                      <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px', overflow: 'hidden' }} >
                        <ParagraphResultsRenderer paragraph={p} showCommandBar={true} key={note.id + '-pr-' + p.id}/>
                      </div>
                    </div>
                 </div>
              </div>
              )
            })
          }
        </div>
      )
    }
    else {
      return <div></div>
    }
  }

  public componentDidMount() {
//    this.scrollTop()
  }
      
  public componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.scrollTop()
    }
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "NOTE") {
      this.setState({
        note: webSocketMessageReceived.data.note
      })
    }
  }

  private scrollTop() {
    console.log('scrollTop -----------')
    goToTop()
/*
    let renderer = ReactDOM.findDOMNode(this.refs['table-renderer-command-bar'])
    if (renderer) {
      var domNode = ReactDOM.findDOMNode(renderer)
      domNode.scrollIntoView({
        block: "start", 
        behavior: "smooth"
      })
    }
*/
  }

}
