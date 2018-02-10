import * as React from 'react'
import * as ReactDOM from 'react-dom'

function selectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

export interface InlineProps {
  minLength: number,
  maxLength: number,
  editingElement: string,
  staticElement: string,
  tabIndex: number,
  isDisabled: boolean,
  editing: boolean
}

export default class InlineEditor extends React.Component<any, any> {

  state = {
    text: this.props.text,
    editing: this.props.editing,
    minLength: this.props.minLength,
    maxLength: this.props.maxLength,
  }

  public static defaultProps: Partial<InlineProps> = {
    minLength: 1,
    maxLength: 256,
    editingElement: 'input',
    staticElement: 'span',
    tabIndex: 0,
    isDisabled: false,
    editing: false
  }

  public render() {

    if (this.props.isDisabled) {
      const Element = this.props.element || this.props.staticElement;
      return <Element
          className={this.props.className}
          style={this.props.style} >
          {this.state.text || this.props.placeholder}
      </Element>
    }

    else if (!this.state.editing) {
      const Element = this.props.element || this.props.staticElement;
      return <Element
          className={this.props.className}
          onClick={this.startEditing}
          tabIndex={this.props.tabIndex}
          style={this.props.style} >
          {this.state.text || this.props.placeholder}
      </Element>
    }

    else {
      const Element = this.props.element || this.props.editingElement;
      return <Element
          onClick={this.clickWhenEditing}
          onKeyDown={this.keyDown}
          onBlur={this.finishEditing}
          className={this.props.activeClassName}
          placeholder={this.props.placeholder}
          defaultValue={this.state.text}
          onChange={this.textChanged}
          style={this.props.style}
          ref="input" />;
    }
    
  }

  public componentWillMount() {
    this.isInputValid = this.props.validate || this.isInputValid;
    // Warn about deprecated elements.
    if (this.props.element) {
      console.warn('`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component');
    }    
  }

  public componentWillReceiveProps(nextProps) {
    const isTextChanged = (nextProps.text !== this.props.text);
    const isEditingChanged = (nextProps.editing !== this.props.editing);
    var nextState = {
      text: this.state.text,
      editing: this.state.editing
    }
    if (isTextChanged) {
        nextState.text = nextProps.text;
    }
    if (isEditingChanged) {
        nextState.editing = nextProps.editing;
    }
    if (isTextChanged || isEditingChanged) {
        this.setState(nextState);
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    var inputElem = ReactDOM.findDOMNode(this.refs.input)
    if (this.state.editing && !prevState.editing) {
 //       inputElem.focus()
        selectInputText(inputElem);
    } else if (this.state.editing && prevProps.text != this.props.text) {
        this.finishEditing()
    }
  }

  private startEditing = (e) => {
      if (this.props.stopPropagation) {
          e.stopPropagation()
      }
      this.setState({editing: true, text: this.props.text});
  }

  private finishEditing = () => {
      if (this.isInputValid(this.state.text) && this.props.text != this.state.text){
          this.commitEditing();
      } else if (this.props.text === this.state.text || !this.isInputValid(this.state.text)) {
          this.cancelEditing();
      }
  }

  private cancelEditing = () => {
      this.setState({editing: false, text: this.props.text});
  }

  private commitEditing = () => {
      this.setState({editing: false, text: this.state.text});
      let newProp = {};
      newProp[this.props.paramName] = this.state.text;
      this.props.change(newProp);
  }

  private clickWhenEditing = (e) => {
      if (this.props.stopPropagation) {
          e.stopPropagation();
      }
  }

  private isInputValid = (text) => {
      return (text.length >= this.state.minLength && text.length <= this.state.maxLength);
  }

  private keyDown = (event) => {
      if (event.keyCode === 13) {
          this.finishEditing();
      } else if (event.keyCode === 27) {
          this.cancelEditing();
      }
  }

  private textChanged = (event) => {
      this.setState({
          text: event.target.value.trim()
      })
  }

}
