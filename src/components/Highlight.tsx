import * as React from 'react'
import * as hljs from 'highlight.js/lib/highlight';
import * as javascript from 'highlight.js/lib/languages/javascript';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';

hljs.registerLanguage('javascript', javascript);

//export class Highlight extends BaseComponent<React.HTMLProps<HTMLDivElement>, {}> {
export class Highlight extends BaseComponent<{}> {
    private _codeElement: HTMLElement;

  public render() {
    return (
      <pre>
        <code
          ref={ this._resolveRef('_codeElement') }
          className='javascript'
        >
          { this.props.children }
        </code>
      </pre>
    );
  }

  public shouldComponentUpdate() {
    return false;
  }

  public componentDidMount() {
    hljs.highlightBlock(this._codeElement);
  }

}
