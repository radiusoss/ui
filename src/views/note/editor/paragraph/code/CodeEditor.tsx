import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../../../actions/NotebookActions'
import { Editor, EditorCommand, Annotation } from 'brace'
import * as isEqual from 'lodash.isequal'
import * as ace from 'brace'
import 'brace/mode/javascript'
import 'brace/mode/markdown'
import 'brace/mode/python'
import 'brace/mode/r'
import 'brace/mode/scala'
import 'brace/theme/github'
import 'brace/theme/monokai'
import 'brace/theme/solarized_light'
import 'brace/theme/tomorrow'
import 'brace/theme/tomorrow_night_blue'
import 'brace/ext/language_tools'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

const { Range } = ace.acequire('ace/range');

const editorOptions = [
  'minLines',
  'maxLines',
  'readOnly',
  'highlightActiveLine',
  'tabSize',
  'enableBasicAutocompletion',
  'enableLiveAutocompletion',
  'enableSnippets'
]

{/*
mode: java | javascript
theme: github | monkai | solarized_light
*/}
export interface CodeEditorProps {
  mode?: string,
  focus?: boolean,
  theme?: string,
  name?: string,
  className?: string,
  height?: string,
  width?: string,
  maxWidth?: string,
  fontSize?: string,
  style?: [string]
  showGutter?: boolean,
  onBeforeLoad?(any),
  onLoad?:(any),
  onChange?(any),
  onCopy?(any),
  onPaste?(any),
  onFocus?(),
  onBlur?(),
  onScroll?(any),
  value?: string,
  defaultValue?: string,
  minLines?: number,
  maxLines?: number,
  readOnly?: boolean,
  highlightActiveLine?: boolean,
  tabSize?: number,
  showPrintMargin?: boolean,
  cursorStart?: number,
  editorProps?: object,
  setOptions?: object,
  annotations?: [Annotation],
  markers?: [string],
  keyboardHandler?: string,
  wrapEnabled?: boolean,
  enableBasicAutocompletion?: boolean | [string],
  enableLiveAutocompletion?: boolean | [string],
  commands?: [EditorCommand],
  scrollMargin?: [number]
}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook, null, { withRef: true })
export default class CodeEditor extends React.Component<any, any> {
  private editor: any
  private refEditor: HTMLElement
  private silent: Boolean

  state = {
    note: {
      id: '',
      paragraphs: []
    },
    paragraphs: []
  }
  
  public static defaultProps: Partial<CodeEditorProps> = {
    name: 'brace-editor',
    focus: true,
    mode: 'scala',
    theme: 'monokai',
//    height: '100%',
    width: '100%',
    fontSize: '12',
    showGutter: true,
    defaultValue: "",
    minLines: null,
    maxLines: null,
    readOnly: false,
    highlightActiveLine: true,
    showPrintMargin: true,
    tabSize: 2,
    cursorStart: -1,
    editorProps: {},
    setOptions: {},
    wrapEnabled: true,
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
    scrollMargin: [0,0,0,0]
  }

  public constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      paragraphs: props.paragraphs
    }
  }

  public render() {
    const { name, width, maxWidth, height, style } = this.props
//    const divStyle = { width, height, ...style }
    const divStyle = { width, height, ...style }
    return (
      <div ref={this.updateRef}
        id={name}
        style={divStyle}
      />
    )
  }

  public componentDidMount() {

    const {
      name,
      className,
      onBeforeLoad,
      mode,
      focus,
      theme,
      fontSize,
      value,
      defaultValue,
      cursorStart,
      showGutter,
      wrapEnabled,
      showPrintMargin,
      scrollMargin,
      keyboardHandler,
      onLoad,
      commands,
      annotations,
      markers,
    } = this.props

    this.editor = ace.edit(this.refEditor)

    this.editor.setAutoScrollEditorIntoView(true)
    this.editor.setOptions({
//      autoScrollEditorIntoView: false,
      indentedSoftWrap: false
    })
    this.editor.$blockScrolling = Infinity

    this.handleOptions(this.props)

    if (onBeforeLoad) {
      onBeforeLoad(ace)
    }

    const editorProps = Object.keys(this.props.editorProps)
    for (var i = 0; i < editorProps.length; i++) {
      this.editor[editorProps[i]] = this.props.editorProps[editorProps[i]]
    }

//    this.editor.renderer.setScrollMargins(scrollMargin[0], scrollMargin[1], scrollMargin[2], scrollMargin[3])
    this.editor.getSession().setMode(`ace/mode/${mode}`)
    this.editor.setTheme(`ace/theme/${theme}`)
    this.editor.setFontSize(fontSize)

//    this.editor.setValue((value === undefined ? defaultValue : value), cursorStart)

    this.editor.renderer.setShowGutter(showGutter)
    this.editor.getSession().setUseWrapMode(wrapEnabled)
    this.editor.setShowPrintMargin(showPrintMargin)

    this.editor.on('focus', this.onFocus)
    this.editor.on('blur', this.onBlur)
    this.editor.on('copy', this.onCopy)
    this.editor.on('paste', this.onPaste)
    this.editor.on('change', this.onChange)

    this.editor.session.on('changeScrollTop', this.onScroll)
    this.editor.getSession().setAnnotations(annotations || [])

    this.handleMarkers(markers || []);

    // Get a list of possible options to avoid 'misspelled option errors'.
    const availableOptions = this.editor.getOptions;
    for (var i = 0; i < editorOptions.length; i++) {
      const option = editorOptions[i];
//      if (availableOptions.hasOwnProperty(option)) {
        this.editor.setOption(option, this.props[option])
//      }
    }

    if (Array.isArray(commands)) {
      commands.forEach((command) => {
        this.editor.commands.addCommand(command)
      })
    }

    if (keyboardHandler) {
      this.editor.setKeyboardHandler('ace/keyboard/' + keyboardHandler)
    }

    if (className) {
      this.refEditor.className += ' ' + className
    }

    if (focus) {
      this.editor.focus()
    }

    if (onLoad) {
      onLoad(this.editor)
    }

    this.editor.runCode = () => this.props.dispatchRunNoteAction(this.state.note.id, this.state.paragraphs[0].id)

    this.editor.commands.addCommand({
      name: "runCode",
      bindKey: {
        win: "Shift-Enter", 
        mac: "Shift-Enter"
      },
      exec: function(editor) {
        editor.runCode()
      }
    })

//  }
/*
  public shouldComponentUpdate(nextProps, nextState) {
    const { note } = nextProps
    if (!note.paragraphs) {
      return false
    }
    return true
  }
*/
//  public componentWillReceiveProps(nextProps) {
//    const { cursorStart, note } = nextProps

    const { note, paragraphs } = this.state
    if (!note.paragraphs) return
//    if (this.state.note.id == note.id) return

    var texts = paragraphs.map(p => {
      return p.text
    })

    var text = texts.join('\n\n')

    this.editor.setValue(text, cursorStart)
    this.editor.focus()
/*
    this.setState({
      note: note,
      paragraphs: note.paragraphs
    })
*/
/*
    const props = this.props;

    for (var i = 0; i < editorOptions.length; i++) {
      const option = editorOptions[i];
      if (nextProps[option] !== props[option]) {
        this.editor.setOption(option, nextProps[option]);
      }
    }

    if (nextProps.className !== props.className) {
      var appliedClasses = this.refEditor.className;
      var appliedClassesArray = appliedClasses.trim().split(' ');
      var oldClassesArray = props.className.trim().split(' ');
      oldClassesArray.forEach((oldClass) => {
        var index = appliedClassesArray.indexOf(oldClass);
        appliedClassesArray.splice(index, 1);
      });
      this.refEditor.className = ' ' + nextProps.className + ' ' + appliedClassesArray.join(' ');
    }

    if (nextProps.mode !== props.mode) {
      this.editor.getSession().setMode('ace/mode/' + nextProps.mode);
    }
    if (nextProps.theme !== props.theme) {
      this.editor.setTheme('ace/theme/' + nextProps.theme);
    }
    if (nextProps.keyboardHandler !== props.keyboardHandler) {
      if (nextProps.keyboardHandler) {
        this.editor.setKeyboardHandler('ace/keyboard/' + nextProps.keyboardHandler);
      } else {
        this.editor.setKeyboardHandler(null);
      }
    }
    if (nextProps.fontSize !== props.fontSize) {
      this.editor.setFontSize(nextProps.fontSize);
    }
    if (nextProps.wrapEnabled !== props.wrapEnabled) {
      this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled);
    }
    if (nextProps.showPrintMargin !== props.showPrintMargin) {
      this.editor.setShowPrintMargin(nextProps.showPrintMargin);
    }
    if (nextProps.showGutter !== props.showGutter) {
      this.editor.renderer.setShowGutter(nextProps.showGutter);
    }

    if (!isEqual(nextProps.setOptions, props.setOptions)) {
      this.handleOptions(nextProps);
    }
    if (!isEqual(nextProps.annotations, props.annotations)) {
      this.editor.getSession().setAnnotations(nextProps.annotations || []);
    }
    if (!isEqual(nextProps.markers, props.markers)) {
      this.handleMarkers(nextProps.markers || []);
    }
    if (!isEqual(nextProps.scrollMargin, props.scrollMargin)) {
      this.handlescrollMargin(nextProps.scrollMargin)
    }

    if (this.editor && this.editor.getValue() !== nextProps.value) {
      this.silent = true // editor.setValue is a synchronous function call, change event is emitted before setValue return.
//      const pos = JSON.stringify(this.editor.session.selection)
      this.editor.setValue(nextProps.value, nextProps.cursorStart)
//      this.editor.session.selection = JSON.parse(pos)
      this.silent = false
    }
    if (nextProps.focus && !props.focus) {
      this.editor.focus()
    }
    if(nextProps.height !== this.props.height){
      this.editor.resize()
    }
*/
  }

  handlescrollMargin(margins = [0, 0, 0, 0]) {
//    this.editor.renderer.setscrollMargin(margins[0], margins[1], margins[2], margins[3])
  }

  componentWillUnmount() {
    this.editor.destroy()
    this.editor = null
  }

  @autobind
  onChange() {
    if (this.props.onChange && !this.silent) {
      const value = this.editor.getValue()
      this.props.onChange(value)
    }
  }

  @autobind
  onFocus() {
    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }

  @autobind
  onBlur() {
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }

  @autobind
  onCopy(text) {
    if (this.props.onCopy) {
      this.props.onCopy(text)
    }
  }

  @autobind
  onPaste(text) {
    if (this.props.onPaste) {
      this.props.onPaste(text)
    }
  }

  @autobind
  onScroll() {
    if (this.props.onScroll) {
      this.props.onScroll(this.editor)
    }
  }

  @autobind
  handleOptions(props) {
    const setOptions = Object.keys(props.setOptions);
    for (var y = 0; y < setOptions.length; y++) {
      this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
    }
  }

  @autobind
  handleMarkers(markers) {
    // remove foreground markers
    var currentMarkers = this.editor.getSession().getMarkers(true);
    for (const i in currentMarkers) {
      if (currentMarkers.hasOwnProperty(i)) {
        this.editor.getSession().removeMarker(currentMarkers[i].id);
      }
    }
    // remove background markers
    currentMarkers = this.editor.getSession().getMarkers(false);
    for (const i in currentMarkers) {
      if (currentMarkers.hasOwnProperty(i)) {
        this.editor.getSession().removeMarker(currentMarkers[i].id);
      }
    }
    // add new markers
    markers.forEach(({ startRow, startCol, endRow, endCol, className, type, inFront = false }) => {
      const range = new Range(startRow, startCol, endRow, endCol);
      this.editor.getSession().addMarker(range, className, type, inFront);
    });
  }

  @autobind
  updateRef(item) {
    this.refEditor = item;
  }

  getValue() {
    return this.editor.getValue()
  }

}
