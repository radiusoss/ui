import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
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
/*
TODO(ECH)
+ Note Results Attributes (State...) and Actions (Cancel..)
+ Show PENDING State as soon as Note is Running
+ Add Progress Bar while Note is Running
+ Manage and Display PROGRESS Messages while Note is Running
+ Clone Note
*/
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteWorkbench extends React.Component<any, any> {
  private notebookApi: NotebookApi

  private paragraphEditors = new Map<string, any>()

  state = {
    note: {
      id: '',
      name: '',
      paragraphs: [{
        id: '',
        title: '',
        text: '',
        status: '',
        config: {
          colWidth: '12'
        }
      }]
    },
    vertical: false,
    numberOfFaces: 3,
    imagesFadeIn: true,
    extraDataType: ExtraDataType.none,
    personaSize: PersonaSize.extraSmall
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    const { note, vertical } = this.state
    if (note.id) {
      var index = 0
      var maxIndex = note.paragraphs.length - 1
      return (
/*
        <div className={styles.rendererHeight} style={{ overflowX: "hidden", fontSize: "small" }}>
*/
        <div style={{ overflowX: "hidden" }}>
          <div className="ms-Grid" style={{ backgroundColor: 'white', padding: 0, margin: 0 }}>
{/*
          <div className="ms-Grid ms-clearfix" style={{ padding: 0 }}>
*/}
            <div className="ms-Grid-row" style={{ padding: 0, margin: 0 }}>
              <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8 ms-textAlignLeft" style={{ padding: '0px 0px 10px 10px', margin: 0 }}>
                <div className="ms-font-xxl ms-fontWeight-semibold">
                  <InlineEditor
                    text={note.name}
                    paramName="title"
                    minLength={3}
                    maxLength={50}
                    change={this.updateTitle}
                    activeClassName="ms-font-xxl ms-fontWeight-semibold"
                  />
                </div>
              </div>
              <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4 ms-textAlignRight">
{/*
                <Toggle
                  defaultChecked={ true }
                  onText='Horizontal'
                  offText='Vertical'
                  onChanged={ (checked: boolean) => this.setState({vertical: checked}) }
                />
*/}
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
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 ms-textAlignCenter">
                <MockContent/>
              </div>
            </div>
*/}
          </div>
          { (vertical) &&
            note.paragraphs.map(p => {
              index++
              return (
                <div className="ms-Grid" key={ note.id + '-' + p.id + '-' + index}>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6" style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>
                      <ParagraphEditor
                        note={note}
                        paragraph={p}
                        index={index-1}
                        maxIndex={maxIndex}
                        showParagraphTitle={true}
                        showControlBar={true}
                        key={note.id + '-pe-' + p.id + "-" + index}
                        focus={index==1}
                      />
                    </div>
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6" style={{ paddingLeft: '0px', margin: '0px' }}>
                      <ParagraphResult
                        note={note}
                        paragraph={p} 
                        showParagraphTitle={false}
                        showControlBar={false} 
                        showGraphBar={true}
                        stripDisplay={true}
                        key={note.id + '-pr-' + p.id + "-" + index}
                      />
                    </div>
                  </div>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" style={{ paddingLeft: '0px', margin: '0px' }}>
                      <hr/>
                    </div>
                  </div>
                </div>
              )
            })
          }
          { (!vertical) && 
          <div className="ms-Grid" style={{margin: 0, padding: 0}}>
            <div className="ms-Grid-row" style={{margin: 0, padding: 0}}>
            {
              note.paragraphs.map(p => {
                index++
                var colWidth = p.config.colWidth
                if (!colWidth) {
                  colWidth = "12"
                  p.config.colWidth = colWidth
                }
                return (
                    <div className={"ms-Grid-col ms-u-sm" + colWidth + " ms-u-md" + colWidth + " ms-u-lg" + colWidth}
                      style={{ 
                        padding: '0px', 
                        margin: '0px'
                      }}
                      key={note.id + '-' + p.id + "-" + index}
                      >
                      <div style={{ 
                        background: 'white', 
                        borderWidth: '1px 1px 2px',
                        boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.3)', 
                        borderColor: 'white',
                        borderRadius: '3px',
                        padding: '10px 10px 20px 10px',
                        margin: '10px 10px 0px 10px'
                        }}>
                        <ParagraphEditor
                          note={note}
                          paragraph={p}
                          index={index-1}
                          maxIndex={maxIndex}
                          showParagraphTitle={true}
                          showControlBar={true}
                          focus={index==1}
                          ref={ ref => { this.paragraphEditors.set(note.id + '-' + p.id, ref) }}
                          />
                        <div style={{height: '10px'}} />
                        <ParagraphResult
                          paragraph={p} 
                          showParagraphTitle={false}
                          showControlBar={false}
                          showGraphBar={true}
                          stripDisplay={true}
                          />
                    </div>
                  </div>
                )
              })
            }
            </div>
          </div>
          }
          {
            <div style={{ height: 10}} />
          }
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

  public componentWillReceiveProps(nextProps) {
    const { webSocketMessageReceived, isStartNoteRun } = nextProps
    if (isStartNoteRun) {
      var i = 0
      if (isStartNoteRun.noteId) {
        if (isStartNoteRun.noteId == this.state.note.id) {
          this.state.note.paragraphs.map(p => {
            var editor = this.paragraphEditors.get(this.state.note.id + '-' + p.id)
            if (editor) {
              var content = editor.getWrappedInstance().getCodeEditorContent()
              p.text = content
            }
            else {
              console.warn("Something is wrong while fetching editor for paragraph from map.", p, this.paragraphEditors)
            }
          })
        }
        this.notebookApi.runAllParagraphsSpitfire(this.state.note.id, this.state.note.paragraphs)
      }
    }
    if (! webSocketMessageReceived) return
    var op = webSocketMessageReceived.op
    if (op == "NOTE") {
      this.setState({
        note: webSocketMessageReceived.data.note
      })
    }
    if (
      (op == "PARAGRAPH_MOVED") 
      || (op == "PARAGRAPH_REMOVED")
      || (op == "PARAGRAPH_ADDED")
    ) {
//      this.notebookApi.getNote(this.state.note.id)
    }
  }

  @autobind
  private updateTitle(message) {
    this.notebookApi.renameNote(this.state.note.id, message.title)
    this.state.note.name = message.title
  }

}
