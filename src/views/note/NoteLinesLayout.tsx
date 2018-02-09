import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import ParagraphEditor from './../paragraph/ParagraphEditor'
import ParagraphResultsRenderer from './../renderer/paragraph/ParagraphResultsRenderer'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { goToTop } from 'react-scrollable-anchor'
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating'
import { Facepile, IFacepilePersona, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile'
import { PersonaSize, PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona'
import { TestImages, facepilePersonas, ExtraDataType } from './../../spl/ImageSpl'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

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
{/*
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-textAlignRight">
                <Rating
                  min={ 1 }
                  max={ 5 }
                  rating={ 4 }
                  onChanged={ rating => toastr.warning('Not yet available', 'Looks like you are eager for the next release to give rating ' + rating) }
                  onFocus={ () => console.log('onFocus called') }
                  onBlur={ () => console.log('onBlur called') }
                />
              </div>
              <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 ms-textAlignLeft">
                <Facepile
                  personaSize={PersonaSize.small}
                  personas={facepilePersonas.slice(0, this.state.numberOfFaces)}
//                getPersonaProps={
//                  imageShouldFadeIn: {this.state.imagesFadeIn}
//                  hidePersonaDetails={false}
//                }
                />
              </div>
            </div>
*/}
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
    this.scrollTop()
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
    console.log('Scrolling to Top of the page...')
    goToTop()
/*
    var renderer = ReactDOM.findDOMNode(this.refs['table-renderer-command-bar'])
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
