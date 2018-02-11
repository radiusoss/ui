import * as React from 'react'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { css } from 'office-ui-fabric-react/lib/Utilities'
import NotebookApi from './../api/notebook/NotebookApi'
import FabricIcon from '../components/FabricIcon'
import history from './../routes/History'
import * as stylesImport from './ExerciseCard.scss'
const styles: any = stylesImport

// import { Highlight } from 'react-highlight/lib'
const Highlight = require('react-highlight')

export interface IExerciseCardProps {
  title?: string;
  isOptIn?: boolean;
  code?: string;
  language?: string;
  children?: any;
  isRightAligned?: boolean;
  dos?: JSX.Element;
  donts?: JSX.Element;
  content?: JSX.Element;
  prerequisites?: JSX.Element;
  noteId?: string;
}

export interface IExerciseCardState {
  isCodeVisible?: boolean;
}

export default class ExerciseCard extends React.Component<IExerciseCardProps, IExerciseCardState> {
  private readonly notebookApi: NotebookApi

  constructor(props: IExerciseCardProps) {
    super(props)
    this.state = {
      isCodeVisible: false
    }
    this.onToggleCodeClick = this.onToggleCodeClick.bind(this)
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { language, title, code, children, isRightAligned } = this.props;
    const { isCodeVisible } = this.state;
    var rootClass = 'ExerciseCard' + (this.state.isCodeVisible ? ' is-codeVisible' : '');

    return (

      <div className={ rootClass }>

        <div className='ExerciseCard-header'>

          { title && <span className='ExerciseCard-title ms-font-l'>{ title }</span> }

          <div className='ExerciseCard-toggleButtons ms-font-l'>
            { code ? (
              <CommandButton 
//                icon='Embed'
                onClick={ this.onToggleCodeClick }
                className={ css('ExerciseCard-codeButton', { 'is-active': isCodeVisible }) }
              >
                { isCodeVisible ? 'Hide code' : 'Show code' }
              </CommandButton>
            ) : (null) }
          </div>
        </div>

        <div className={ css(styles.codeBlock, styles.isDarkTheme) }>
          { isCodeVisible && (
            <Highlight className={ language }>
              { code }
            </Highlight>
          ) }
        </div>

        { this.getLinkToNote() }

        <div className={ css('ExerciseCard-example', { ' is-right-aligned': (isRightAligned) }) } data-is-scrollable='true'>
          { children }
        </div>

        { this.getObjectivesAndPrerequisites() }

        { this.getDosAndDonts() }

      </div>

    )

  }

  private getDosAndDonts() {
    if (this.props.dos && this.props.donts) {
      return (
        <div className='ExerciseCard-dosAndDonts'>
          <div className='ExerciseCard-dos align-top'>
            <h4>Do</h4>
            { this.props.dos }
          </div>
          <div className='ExerciseCard-donts align-top'>
            <h4>Do not</h4>
            { this.props.donts }
          </div>
        </div>
      )
    }
  }

  private getLinkToNote() {
    if (this.props.noteId) {
      return (
        <a href="#" onClick={(e) => this.goToNote(e) } className="nav-link" ><FabricIcon name="QuickNote" /> Reference note.</a>
      )
    }
  }

  private getObjectivesAndPrerequisites() {
    if (this.props.content && this.props.prerequisites) {
      return (
        <div className='ExerciseCard-contentAndPrerequisites'>
          <div className='ExerciseCard-content align-top'>
            <h4>Content</h4>
            { this.props.content }
          </div>
          <div className='ExerciseCard-prerequisites align-top'>
            <h4>Prerequisites</h4>
            { this.props.prerequisites }
          </div>
        </div>
      )
    }
  }

  private onToggleCodeClick() {
    this.setState({
      isCodeVisible: !this.state.isCodeVisible
    })
  }

  private goToNote(e: React.MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation()
    e.preventDefault()
    this.notebookApi.showNoteLayout(this.props.noteId, 'lines')
//    history.push(`/dla/explorer/note/lines/${this.props.noteId}`)
  }

}
