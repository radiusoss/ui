import * as React from 'react'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { Form, FormConditionalSubmitButton, FormDatePicker, FormDropdown, FormCheckBox, FormTextInput, Validators } from '@uifabric/experiments/lib/Form'
import { LayoutGroup } from '@uifabric/experiments/lib/LayoutGroup'
import NotebookApi from '../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { toastr } from 'react-redux-toastr'

export default class History extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    message: ''
  }

  public constructor(props) {    
    super(props)
  }

  public render() {
    const { message } = this.state
    return (
      <div>
        <div style={{float: "left"}}>
          <Icon iconName='GitGraph' className='ms-Icon50' />
        </div>
        <div style={{float: "left"}}>
          <div className='ms-font-su'>History</div>
        </div>
        <div className="ms-clearfix"/>
        <div className="ms-Grid" style={{ padding: 0}}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Form
                onSubmit={ this.submit } 
                showErrorsWhenPristine={ true }
                >
               <LayoutGroup layoutGap={ 20 } direction='vertical' justify='fill'>
                  <FormTextInput
                    textFieldProps={{
                      label: 'Commit Message',
                      placeholder: 'Type your commit message...',
                      iconProps: { iconName: 'BranchCommit' }
                    }}
                    value={message}
                    inputKey='message'
                    validators={[
                      Validators.minLength(3, (length: number) => 'Your commit message must be greater than 3 characters.'),
                      Validators.maxLength(20, (length: number) => 'Your commit message must be less than 20 characters.')
                    ]}
                    />
                    <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                        }
                      }}
                      >
                      Commit
                    </FormConditionalSubmitButton>
                  </LayoutGroup>
                </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.notebookApi = window['NotebookApi']
  }

  @autobind
  private submit(values: any): void {
    var message = values.message
    this.notebookApi.checkpointNote("_conf", message)
    toastr.info("Commit", "The notebook is committed with message: " + message)
    this.setState({
      message: ''
    })
  }

}
