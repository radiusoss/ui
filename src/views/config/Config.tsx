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
import { LayoutGroup } from '@uifabric/experiments/lib/LayoutGroup';
import { Form, FormConditionalSubmitButton, FormDatePicker, FormDropdown, FormCheckBox, FormTextInput, Validators } from '@uifabric/experiments/lib/Form'
import { CompoundButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import CalendarSlotsSpl from './../../spl/CalendarSlotsSpl'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import KuberApi from '../../api/kuber/KuberApi'
import ConfigApi from '../../api/config/ConfigApi'

const MAX_LENGTH = 20

export type IKuberState = {
  wsMessages: any[]
  jsonMessage: any
  formResults: any
  disabled: boolean
  checked: boolean
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Config extends React.Component<any, IKuberState> {
  private k8sApi: KuberApi
  private configApi: ConfigApi
  private config: IConfig = NotebookStore.state().config
  private method: string
  private wsMessage: any

  state = {
    wsMessages: new Array(),
    jsonMessage: {},
    formResults: null,
    disabled: false,
    checked: false
  } 

  public constructor(props) {    
    super(props)
  }

  public componentDidMount() {
    this.configApi = window['ConfigApi']
    this.k8sApi = window['KuberApi']
  }

  public render() {
    const { disabled, checked } = this.state
    return (
      <div>
        <div className="ms-font-xxl">Kuber Configuration</div>
        <Form 
          onSubmit={ this.submit } 
          showErrorsWhenPristine={ true }
        >
          <LayoutGroup layoutGap={ 20 } direction='vertical'>
            <div className="ms-Grid	ms-slideRightIn40 ms-clearfix">
              <div className="ms-Grid-row ms-clearfix">
                <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-clearfix">
                <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'LOAD_CONFIG'
                      }
                    }}
                    >
                    Get Config
                  </FormConditionalSubmitButton>
                  <div style={{ padding: "10px", backgroundColor: "black" }}>
                    <JSONTree 
                      data={this.state.jsonMessage} 
                      theme='greenscreen'
                      invertTheme={false}
                    />
                  </div>
                </div>
                <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-clearfix">
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'PING'
                          this.wsMessage = this.k8sApi.PING()
                        }
                      }}
                    >
                    PING
                  </FormConditionalSubmitButton>
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'GET_SLOTS'
                          this.wsMessage = this.k8sApi.GET_SLOTS()
                        }
                      }}
                    >
                    GET_SLOTS
                  </FormConditionalSubmitButton>
                  <FormConditionalSubmitButton
                      buttonProps={{
                        onClick: (e) => {
                          this.method = 'PUT_SLOTS'
                          this.wsMessage = this.k8sApi.PUT_SLOTS(CalendarSlotsSpl)
                        }
                      }}
                    >
                    PUT_SLOTS
                  </FormConditionalSubmitButton>
                  <div style={{ padding: "10px", backgroundColor: "black", color: "rgb(0, 187, 0)"}}>
                    {
                      this.state.wsMessages.map((w) => {
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
//      if (kuberMessageReceived.op != "PING") {
        var msg = this.state.wsMessages
        if (msg.length > MAX_LENGTH) {
            msg = msg.slice(0, MAX_LENGTH - 1)
        }
        msg.unshift(new Date().toTimeString() + ' - ' + JSON.stringify(kuberMessageReceived))
        this.setState({
          wsMessages: msg
        })
//      }
    }
  }

  @autobind
  private submit(values: any): void {
    values.name = values.name_input
    if (this.method == 'PING') {
      this.k8sApi.send(this.wsMessage)
      return
    }
    if (this.method == 'PUT_SLOTS') {
      this.k8sApi.putSlots(CalendarSlotsSpl)
      return
    }
    if (this.method == 'GET_SLOTS') {
      this.k8sApi.getSlots()
      return
    }
    if (this.method == 'LOAD_CONFIG') {
      this.setState({jsonMessage: this.configApi.getConfig()})
      return
    }
  
  }

}
