import * as React from 'react'
import { css } from 'office-ui-fabric-react/lib/Utilities'
import * as stylesImport from './CodeBlock.module.scss'
const styles: any = stylesImport

// import { Highlight } from 'react-highlight/lib'
const Highlight = require('react-highlight')

export interface ICodeBlockProps extends React.HTMLProps<HTMLElement> {
  /**
   * The language of the code block. See https://highlightjs.org/static/demo/ for a list of supported languages.
   * @default html
   */
  language: string;

  /**
   * Whether or not the code block can be toggled opened and closed.
   * @default false
   */
  isCollapsible?: boolean;

  /**
   * Theme to display the code with.
   * @default false
   */
  isLightTheme?: boolean;
}

export interface ICodeBlockState {
  /**
   * Whether the code block is open or collapsed.
   */
  isOpen?: boolean;
}

export default class CodeBlock extends React.Component<ICodeBlockProps, ICodeBlockState> {
  public static defaultProps: ICodeBlockProps = {
    language: 'html',
    isCollapsible: false,
    isLightTheme: false
  };

  constructor(props: ICodeBlockProps) {
    super(props);

    this.state = {
      isOpen: false
    };

    this._onToggleClicked = this._onToggleClicked.bind(this);
  }

  public render() {
    let { language, isCollapsible, isLightTheme, children } = this.props;
    let { isOpen } = this.state;

    let toggleButton;
    if (isCollapsible) {
      toggleButton = <button className={ styles.toggle } onClick={ this._onToggleClicked.bind(this) }>&lt;/&gt;</button>;
    }

    return (
      <div className={ css(
        styles.codeBlock,
        isCollapsible ? styles.isCollapsible : '',
        isOpen ? styles.isOpen : '',
        isLightTheme ? styles.isLightTheme : styles.isDarkTheme
      ) }>
        { toggleButton }
        <div className={ styles.code }>
          <Highlight className={ language }>
            { children }
          </Highlight>
        </div>
      </div>
    );
  }

  private _onToggleClicked() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

}
