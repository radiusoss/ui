import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import ParagraphEditor from './../paragraph/ParagraphEditor'
import ParagraphDisplay from './../paragraph/ParagraphDisplay'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import { ParagraphStatus, isParagraphRunning } from './../paragraph/ParagraphUtil'
import InlineEditor from './../editor/InlineEditor'
import { downloadJSON } from './../../util/data/DataActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import NotePermissions from './NotePermissions'
import MockContent from './../message/MockContent'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating'
import { Facepile, IFacepilePersona, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile'
import { PersonaSize, PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona'
import { TestImages, facepilePersonas, ExtraDataType } from './../../spl/ImageSpl'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import * as Scroll from 'react-scroll'
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class NoteWorkbench extends React.Component<any, any> {
  private notebookApi: NotebookApi

  private paragraphEditors = new Map<string, any>()
  private paragraphDisplays = new Map<string, any>()

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
    personaSize: PersonaSize.extraSmall,
    paragraphAnchor: null,
    showPermissionsPanel: false
  }

  public constructor(props) {
    super(props)
    this.paragraphEditors = new Map<string, any>()
    this.paragraphDisplays = new Map<string, any>()
    this.state = {
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
      personaSize: PersonaSize.extraSmall,
      paragraphAnchor: this.props.match.params.paragraphId,
      showPermissionsPanel: false
    }
  }

  public render() {
    const { note, vertical, showPermissionsPanel } = this.state
    if (note.id) {
      var index = 0
      var maxIndex = note.paragraphs.length - 1
      return (
/*
        <div className={styles.rendererHeight} style={{ overflowX: "hidden", fontSize: "small" }}>
*/
        <div style={{ overflowX: "hidden" }}>
          <Panel
            isOpen={ showPermissionsPanel }
            type={ PanelType.smallFixedFar }
            headerText="Permissions"
            onDismiss={() => this.setState({showPermissionsPanel: false})}
            >
            <div>
              <NotePermissions permNote={note}/>
            </div>
          </Panel>        
          <div className="ms-Grid" style={{ backgroundColor: 'white', padding: 0, margin: 0 }}>
{/*
          <div className="ms-Grid ms-clearfix" style={{ padding: 0 }}>
*/}
            <div className="ms-Grid-row" style={{ padding: 0, margin: 0 }}>
              <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8 ms-textAlignLeft" style={{ padding: '0px 0px 0px 10px', margin: 0 }}>
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
                <CommandBar
                  isSearchBoxVisible={ false }
                  items={[]}
                  farItems={[
                    {
                      key: 'download',
                      title: 'Download this note as JSON',
                      name: '',
                      icon: 'Download',
                      onClick: (e) => this.downloadNote(e, this.state.note)
                    },
                    {
                      key: 'clone',
                      title: 'Clone this Note',
                      name: '',
                      icon: 'Copy',
                      onClick: (e) => this.cloneNote()
                    },
                    {
                      key: 'permissions',
                      title: 'Note Permissions',
                      name: '',
                      icon: 'Permissions',
                      onClick: (e) => this.setState({showPermissionsPanel: true})
                    }
                  ]}
                  className={ styles.commandBarBackgroundTransparent }
                  />
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
                      <Element name={note.id + '-anchor-' + p.id} className="element">
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
                      </Element>
                    </div>
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6" style={{ paddingLeft: '0px', margin: '0px' }}>
                      <ParagraphDisplay
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
                        <ParagraphDisplay
                          paragraph={p} 
                          showParagraphTitle={false}
                          showControlBar={false}
                          showGraphBar={true}
                          stripDisplay={true}
                          ref={ ref => { this.paragraphDisplays.set(note.id + '-' + p.id, ref) }}
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
            <div style={{ height: 10}}>
              {
                (this.state.paragraphAnchor) &&
                  scroller.scrollTo(note.id + '-anchor-' + this.state.paragraphAnchor, {
                    duration: 1500,
                    delay: 100,
                    smooth: true,
                    offset: 50, // Scrolls to element + 50 pixels down the page
                  })
              }
            </div>
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
//    this.notebookApi.getNote(this.props.match.params.noteId)
  }

  public componentWillReceiveProps(nextProps) {
    const { spitfireMessageReceived, isStartNoteRun, isStartParagraphRun } = nextProps
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
            var display = this.paragraphDisplays.get(this.state.note.id + '-' + p.id)
            if (display) {
              display.getWrappedInstance().showStartRun()
            }
            else {
              console.warn("Something is wrong while fetching display for paragraph from map.", p, this.paragraphEditors)
            }
          })
        }
        this.notebookApi.runAllParagraphsSpitfire(this.state.note.id, this.state.note.paragraphs)
      }
    }
    if (isStartParagraphRun) {
      if (isStartParagraphRun.noteId == this.state.note.id) {
        var display = this.paragraphDisplays.get(isStartParagraphRun.noteId + '-' + isStartParagraphRun.paragraphId).getWrappedInstance()
        display.showStartRun()
        var editor = this.paragraphEditors.get(isStartParagraphRun.noteId + '-' + isStartParagraphRun.paragraphId).getWrappedInstance()
        var code = editor.getCodeEditorContent()
        this.notebookApi.runParagraph(editor.state.paragraph, code)
      }
    }
    if (! spitfireMessageReceived) return
    var op = spitfireMessageReceived.op
    if (op == "NOTE") {
      this.setState({
        note: spitfireMessageReceived.data.note
      })
    }
  }

  @autobind
  private updateTitle(message) {
    this.notebookApi.renameNote(this.state.note.id, message.title)
    this.state.note.name = message.title
  }

  private cloneNote() {
    this.notebookApi.cloneNote(this.state.note.id, 'Clone of ' + this.state.note.name)
  }

  private downloadNote(e: React.MouseEvent<HTMLElement>, json: {}) {
    e.preventDefault()
    downloadJSON({
      filename: "note_" + new Date().toISOString().replace(" ", "_") + ".json",
      json: json
    })
  }    

}
