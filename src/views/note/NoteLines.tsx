import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import ParagraphEditor from './../paragraph/ParagraphEditor'
import ParagraphResult from './../paragraph/ParagraphResult'
import InlineEditor from './../editor/InlineEditor'
import NotebookApi from './../../api/notebook/NotebookApi'
import MockContent from './../message/MockContent'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating'
import { Facepile, IFacepilePersona, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile'
import { PersonaSize, PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona'
import { TestImages, facepilePersonas, ExtraDataType } from './../../spl/ImageSpl'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import * as Scroll from 'react-scroll'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteLines extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    note: {
      id: '',
      name: '',
      paragraphs: []
    },
    numberOfFaces: 3,
    imagesFadeIn: true,
    extraDataType: ExtraDataType.none,
    personaSize: PersonaSize.extraSmall,
    scrollTop: 0
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { note } = this.state
    if (note.id) {
      var i = 0
      return (
        <div style={{ backgroundColor: "white", overflowX: "hidden"}}>
{/*
*/}
          <div className="ms-Grid">
{/*
          <div className="ms-Grid ms-clearfix" style={{ padding: 0 }}>
*/}
          <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 ms-textAlignCenter">
                <div className="ms-font-xxl">
                  <InlineEditor
                    text={note.name}
                    paramName="title"
                    minLength={3}
                    maxLength={33}
                    change={this.updateTitle}
                    activeClassName="ms-font-xxl"
                  />
                </div>
              </div>
            </div>
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
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 ms-textAlignCenter">
                <MockContent/>
              </div>
            </div>
          </div>
          {
            note.paragraphs.map(p => {
              i++
              return (
                <div className="ms-Grid" key={ note.id + '-' + p.id }>
                  <div className="ms-Grid-row">
                    <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px' }}>
                      <ParagraphEditor 
                        note={note} 
                        paragraph={p} 
                        index={i-1} 
                        showControlBar={true} 
                        showParagraphTitle={false} 
                        key={note.id + '-pe-' + p.id + "-" + new Date().getTime} 
                        focus={i==1}
                      />
                    </div>
                    <div className={`ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6`} style={{ paddingLeft: '0px', margin: '0px', overflow: 'hidden' }} >
                      <ParagraphResult 
                        paragraph={p} 
                        showControlBar={false} 
                        showGraphBar={true}
                        showParagraphTitle={true} 
                        key={note.id + '-pr-' + p.id + "-" + new Date().getTime}
                      />
                    </div>
                    <div className="ms-Grid-row">
                      <div className={`ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12`} style={{ paddingLeft: '0px', margin: '0px' }}>
                        <hr/>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          <div style={{ display: "none"}}>{this.state.scrollTop = this.state.scrollTop + 1}</div>
        </div>
      )
    }
    else {
      return <div></div>
    }
  }

  public componentDidMount() {
    this.notebookApi = window['NotebookApi']
  }

  public componentWillUpdate(nextProps, nextState) {
    if (nextState.scrollTop == 1) {
      var sc = Scroll.animateScroll
      sc.scrollToTop({
        smooth: true
      })
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    if (prevState.scrollTop == 1) {
      var sc = Scroll.animateScroll
      sc.scrollToTop({
        smooth: true
      })
    }
  }

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived } = nextProps
    if (! webSocketMessageReceived) return
    if (webSocketMessageReceived.op == "NOTE") {
      this.setState({
        scrollTop: 0,
        note: webSocketMessageReceived.data.note
      })
    }
  }

  @autobind
  private updateTitle(message) {
    this.notebookApi.renameNote(this.state.note.id, message.title)
    this.state.note.name = message.title
  }

}
