import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { emailRegexp } from './../../util/msc/regexp'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { LayoutGroup } from '@uifabric/experiments/lib/LayoutGroup'
import { Form, FormConditionalSubmitButton, FormDatePicker, FormDropdown, FormCheckBox, FormTextInput, Validators } from '@uifabric/experiments/lib/Form'
import { CompoundButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import KuberApi from '../../api/kuber/KuberApi'

const MAX_LENGTH = 20

export type IKuberState = {
  spitfireMessages: any[]
  restResponse: any
  formResults: any
  disabled: boolean
  checked: boolean
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class KuberSpl extends React.Component<any, IKuberState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  private kuberApi: KuberApi
  private method: string
  private url: string
  private spitfireMessage: any

  state = {
    spitfireMessages: new Array(),
    restResponse: {},
    formResults: null,
    disabled: false,
    checked: false
  } 

  public constructor(props) {    
    super(props)
  }

  public async componentDidMount() {
    this.kuberApi = window['KuberApi']
  }

  public render() {

    const { disabled, checked } = this.state

    return (
      <div>
        <Form 
          onSubmit={ this.submit } 
          showErrorsWhenPristine={ true }
        >
          <LayoutGroup layoutGap={ 20 } direction='vertical'>
            <div className="ms-Grid	ms-slideRightIn40 ms-clearfix">
              <div className="ms-Grid-row ms-clearfix">
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
                  <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'GET'
                        this.url = 'http://localhost:9091/kuber/api/v1/cluster?filterBy=&itemsPerPage=10&name=&namespace=&page=1&sortBy=d,creationTimestamp'
                      }
                    }}
                  >
                    GET Kuber Cluster
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'GET'
                        this.url = 'http://localhost:9091/kuber/api/v1/overview?filterBy=&itemsPerPage=10&name=&page=1&sortBy=d,creationTimestamp'
                      }
                    }}
                  >
                    GET Kuber Overview
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'GET'
                        this.url = 'http://localhost:9091/kuber/api/v1/helm'
                      }
                    }}
                  >
                    GET Helm Deployments
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'GET'
                        this.url = 'http://localhost:9091/kuber/api/v1/config'
                      }
                    }}
                    >
                    GET Config
                  </FormConditionalSubmitButton>
                </div>            
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
                  <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'GET'
                        this.url = 'http://localhost:9091/kuber/api/v1/cloud/aws/eu-central-1/volumes'
                      }
                    }}
                    >
                    GET AWS Volumes (us-west-2)
                  </FormConditionalSubmitButton>
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
                  <FormConditionalSubmitButton
                        buttonProps={{
                          onClick: (e) => {
                            this.method = 'GET'
                            this.url = 'http://localhost:9091/kuber/api/v1/user'
                          }
                        }}
                      >
                      GET Users
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'POST'
                          this.url = 'http://localhost:9091/kuber/api/v1/user/name-1'
                        }
                      }}
                      >
                      POST User
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'DELETE'
                          this.url = 'http://localhost:9091/kuber/api/v1/user/name-1'
                        }
                      }}
                      >
                      DELETE User
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'GET'
                          this.url = 'http://localhost:9091/kuber/api/v1/spl'
                        }
                      }}
                    >
                    GET Samples
                  </FormConditionalSubmitButton>
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
                  <FormConditionalSubmitButton
                        buttonProps={{
                          onClick: (e) => {
                            this.method = 'WS'
                            this.spitfireMessage = this.kuberApi.KUBER_PING()
                          }
                        }}
                      >
                      WS PING
                    </FormConditionalSubmitButton>
                    <br/>
                    <br/>
                    <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'WS'
                          this.spitfireMessage = this.kuberApi.CREATE_CLUSTER_DEF()
                        }
                      }}
                    >
                    WS Create Cluster Def
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'WS'
                          this.spitfireMessage = this.kuberApi.CREATE_CLUSTER()
                        }
                      }}
                    >
                    WS Create Cluster
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'WS'
                          this.spitfireMessage = this.kuberApi.DELETE_CLUSTER()
                        }
                      }}
                    >
                    WS Delete Cluster
                  </FormConditionalSubmitButton>
                </div>
              </div>
            </div>
            <div className="ms-Grid	ms-slideRightIn40 ms-clearfix">
              <div className="ms-Grid-row ms-clearfix" style={{ width: "100%"}}>
                <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-clearfix">
                  <h4>REST Response</h4>
                  <div style={{ padding: "10px", backgroundColor: "black" }}>
                    <JSONTree 
                      data={this.state.restResponse} 
                      theme='greenscreen'
                      invertTheme={false}
                    />
                  </div>
                </div>
                <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-clearfix">
                <h4>Websocket Messages</h4>
                  <div style={{ padding: "10px", backgroundColor: "black", color: "rgb(0, 187, 0)"}}>
                    {
                      this.state.spitfireMessages.map((w) => {
                        return (
                          <small key={ Math.random() }>
                              { w }
                              <br/>
                          </small>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            <LayoutGroup layoutGap={ 20 } direction='horizontal' justify='fill'>
              <FormTextInput
                textFieldProps={{ 
                  label: 'Name'
                }}
                value="A name"
                inputKey='name_input'
                validators={ [
                  Validators.minLength(2, (length: number) => 'Must be greater than 2 characters.'),
                  Validators.maxLength(10, (length: number) => 'Must be less than 10 characters.')
                ] }
              />
              <FormTextInput
                textFieldProps={{
                  label: 'Email'
                }}
                value="eric@datalayer.io"
                inputKey='email'
                validators={[
                  Validators.regex(emailRegexp, 'This is not a valid email.')
                  ]}
              />
              <FormTextInput
                textFieldProps={{
                  label: 'Phone number'
                }}
                value="A phone number..."
                inputKey='phone'
                validators={[
                  Validators.required('Field is required')
                ]}
              />
            </LayoutGroup>
            <LayoutGroup layoutGap={ 20 } direction='horizontal' justify='fill'>
              <FormTextInput 
                textFieldProps={{
                  label: 'TextField with a placeholder',
                  placeholder: 'Now I am a Placeholder',
                  ariaLabel: 'Please enter text here'
                }}
                inputKey='name'
              />
              <FormTextInput 
                textFieldProps={{
                  label: 'TextField with an icon',
                  placeholder: 'Now I am a Placeholder',
                  ariaLabel: 'Please enter text here',
                  iconProps: { iconName: 'Calendar' }
                }}
                inputKey='name'                
              />
              <FormTextInput 
                textFieldProps={{
                  label: 'TextField with an icon',
                  placeholder: 'Now I am a Placeholder',
                  ariaLabel: 'Please enter text here',
                  iconProps: { iconName: 'Calendar' },
                  multiline: true,
                  rows: 4
                }}                
                inputKey='name'                
              />
            </LayoutGroup>
            <LayoutGroup layoutGap={ 20 } direction='horizontal' justify='fill'>
              <ChoiceGroup
                defaultSelectedKey='B'
                options={ [
                  {
                    key: 'A',
                    text: 'Option A',
                    disabled: true
                  },
                  {
                    key: 'B',
                    text: 'Option B',
                    disabled: true
                  },
                  {
                    key: 'C',
                    text: 'Option C',
                    disabled: true
                  },
                  {
                    key: 'D',
                    text: 'Option D',
                    disabled: true
                  }
                ] }
                label='Pick one'
                required={ true }
              />
              <LayoutGroup layoutGap={ 10 }>
                <Label>Pick a few</Label>
                <FormCheckBox
                  checkboxProps={ { label: 'Checkbox A' } }
                  inputKey='checkA'
                />
                <FormCheckBox
                  checkboxProps={ { label: 'Checkbox B' } }
                  inputKey='checkB'
                />
                <FormCheckBox
                  checkboxProps={ { label: 'Checkbox C' } }
                  inputKey='checkC'
                />
                <FormCheckBox
                  checkboxProps={ { label: 'Checkbox D' } }
                  inputKey='checkD'
                />
                <FormCheckBox
                  checkboxProps={ { label: 'Checkbox E' } }
                  inputKey='checkE'
                />
              </LayoutGroup>
            </LayoutGroup>
          </LayoutGroup>
        </Form>
      </div>
    )

  }

  public componentWillReceiveProps(nextProps) {
    const { config, kuberMessageReceived } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
    if (kuberMessageReceived && kuberMessageReceived.op) {
      if (kuberMessageReceived.op != "PING") {
        var msg = this.state.spitfireMessages
        if (msg.length > MAX_LENGTH) {
            msg = msg.slice(0, MAX_LENGTH - 1)
        }
        msg.unshift(new Date().toTimeString() + ' - ' + JSON.stringify(kuberMessageReceived))
        this.setState({
          spitfireMessages: msg
        })
      }
    }
  }

  private newRestClient(url: string) {
    this.setState({restResponse: {}})
    return new RestClient({
      name: 'KuberSpl',
      url: url,
      path: '/'
    })
  }

  @autobind
  private submit(values: any): void {
    values.name = values.name_input
    if (this.method == 'WS') {
      this.kuberApi.send(this.spitfireMessage)
      return
    }
    this.restClient = this.newRestClient(this.url)
    switch (this.method) {
      case 'GET':
        this.restClient.get<{}>(values, jsonOpt, "")
          .then(json => { this.setState({restResponse: json})})
        break
      case 'POST':
        this.restClient.post<{}>(values, {}, jsonOpt, "")
          .then(json => { this.setState({restResponse: json})})
        break
      case 'PUT':
        this.restClient.put<{}>(values, {}, jsonOpt, "")
          .then(json => { this.setState({restResponse: json})})
        break
      case 'DELETE':
        this.restClient.delete<{}>(values, jsonOpt, "")
          .then(json => { this.setState({restResponse: json})})
      break
    }
  
  }

}
