import * as React from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'

export const Code1Text = `import * as React from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
`.replace(/\t/g, '')

export const Code2Text = `import * as React from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export class Example1 extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <TextField label='Default TextField' onChanged={ this._onChanged } />
        <TextField label='Disabled TextField' disabled={ true } />
        <TextField label='Required TextField' required={ true } />
        <TextField label='TextField with a placeholder' placeholder='Now I am a Placeholder' ariaLabel='Please enter text here' />
        <TextField label='TextField with an icon' iconClass='ms-Icon--Calendar ms-Icon' />
        <TextField label='Multiline TextField' multiline rows={ 4 } iconClass='ms-Icon--Calendar ms-Icon' />
        <TextField label='Multiline TextField Unresizable' multiline resizable={ false } />
        <TextField label='Multiline TextField with auto adjust height' multiline autoAdjustHeight />
        <TextField label='Underlined TextField' underlined />
      </div>
    );
  }

  @autobind
  private _onChanged(text) {
    
  }
}
`.replace(/\t/g, '')

export const Code3Text = `print(sample(1:3))
print(sample(1:3, size=3, replace=FALSE))  # same as previous line
print(sample(c(2,5,3), size=4, replace=TRUE)
print(sample(1:2, size=10, prob=c(1,3), replace=TRUE))
`.replace(/\t/g, '')

export class Code extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <TextField label='Default TextField' onChanged={ this._onChanged } />
        <TextField label='Disabled TextField' disabled={ true } />
        <TextField label='Required TextField' required={ true } />
        <TextField label='TextField with a placeholder' placeholder='Now I am a Placeholder' ariaLabel='Please enter text here' />
        <TextField label='TextField with an icon' iconClass='ms-Icon--Calendar ms-Icon' />
        <TextField label='Multiline TextField' multiline rows={ 4 } iconClass='ms-Icon--Calendar ms-Icon' />
        <TextField label='Multiline TextField Unresizable' multiline resizable={ false } />
        <TextField label='Multiline TextField with auto adjust height' multiline autoAdjustHeight />
        <TextField label='Underlined TextField' underlined />
      </div>
    );
  }

  @autobind
  private _onChanged(text) {    
  }

}
