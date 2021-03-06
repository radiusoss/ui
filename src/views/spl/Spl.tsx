import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { CompoundButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import { Form, FormConditionalSubmitButton, FormDatePicker, FormTextInput, Validators } from '@uifabric/experiments/lib/Form'
import { emailRegexp } from './../../util/msc/regexp'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import KuberApi from '../../api/kuber/KuberApi'
import JSONTree from 'react-json-tree'

export type IKuberState = {
    spitfireMessages: any[]
    restResponse: any
    formResults: any
    disabled: boolean
    checked: boolean
}

const MAX_LENGTH = 20

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Spl extends React.Component<any, IKuberState> {
  private config: IConfig = NotebookStore.state().config
  private kuberApi: KuberApi
  private restClient: RestClient

  state = {
    spitfireMessages: new Array(),
    restResponse: {},
    formResults: null,
    disabled: false,
    checked: false
  } 

  public constructor(props) {    
    super(props)
    this.restClient = this.newRestClient()
  }

  public render() {

    const { disabled, checked } = this.state

    return (

      <div>

        <h1>Kuber</h1>
        
        <div className="callout m-0 py-h text-center bg-faded text-uppercase">
          <small><b>Received Messages</b></small>
        </div>
        {
          this.state.spitfireMessages.map((w) => {
            return (
              <small key={ Math.random() }>
                  { JSON.stringify(w) }
                  <br/>
              </small>
            )
          })
        }

        <h1>Samples</h1>

        <div>
          <Form onSubmit={ this.onSubmit } 
              showErrorsWhenPristine={true}
              >
            <FormTextInput
              textFieldProps={ { label: 'Name' } }
              inputKey='name'              
              validators={ [
                Validators.minLength(2, (length: number) => 'Must be greater than 2 characters.'),
                Validators.maxLength(10, (length: number) => 'Must be less than 10 characters.')
              ] }
            />
            <FormTextInput
              textFieldProps={ { label: 'Email' } }
              inputKey='email'
              validators={ [
                Validators.regex(emailRegexp, 'This is not a valid email.')
                ] }
            />
            <FormTextInput
              textFieldProps={ { label: 'Telephone' } }
              inputKey='tel'
              validators={ [
                Validators.required('Field is required')
              ] }
            />
            <FormConditionalSubmitButton>Create or Update Sample</FormConditionalSubmitButton>
          </Form>
        </div>

        <hr/>

        <div className="ms-Grid	ms-slideRightIn40 ms-clearfix">
          <div className="ms-Grid-row ms-clearfix">
            <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
              <CompoundButton
                primary = { true }
                description = { 'GET ' + this.config.kuberRest }
                disabled = { disabled }
                checked = { checked }
                onClick =  { (e) => this.getAllSpl(e, this.config.kuberRest + "/kuber/api/v1/spl") }
                >
                Get All Samples
              </CompoundButton>
            </div>            
            <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
              <CompoundButton
                primary = { true }
                description = { 'GET ' + this.config.kuberRest }
                disabled = { disabled }
                checked = { checked }
                onClick = { (e) => this.getSpl(e, this.config.kuberRest + "/kuber/api/v1/spl/name-1") }
                >
                Get Sample
              </CompoundButton>
            </div>
            <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
              <CompoundButton
                primary = { true }
                description = { 'PUT ' + this.config.kuberRest }
                disabled = { disabled }
                checked = { checked }
                onClick = { (e) => this.updateSpl(e, this.config.kuberRest + "/kuber/api/v1/spl/name-1") }
                >
                Update Sample
              </CompoundButton>
            </div>
            <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
              <CompoundButton
                primary = { true }
                description = { 'DELETE ' + this.config.kuberRest }
                disabled = { disabled }
                checked = { checked }
                onClick = { (e) => this.deleteSpl(e, this.config.kuberRest + "/kuber/api/v1/spl/name-1") }
                >
                Delete Sample
              </CompoundButton>
            </div>
          </div>
          <div className="ms-Grid-row ms-clearfix" style={{ width: "100%"}}>
            <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2 ms-clearfix" style={{ width: "100%"}}>
              <div style={{ padding: "10px", backgroundColor: "black" }}>
                <JSONTree 
                  data={this.state.restResponse} 
                  theme='greenscreen'
                  invertTheme={false}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    )

  }

  public async componentDidMount() {
    this.kuberApi = window['KuberApi']
//    this.kuberApi.command("/bin/ls")
  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
      this.restClient = this.newRestClient()
    }
    const { kuberMessageReceived } = nextProps
    if (kuberMessageReceived.op) {
      var msg = this.state.spitfireMessages
      if (msg.length > MAX_LENGTH) {
          msg = msg.slice(0, MAX_LENGTH - 1)
      }
//      msg.unshift(kuberMessageReceived.message)
      msg.unshift(kuberMessageReceived)
      this.setState({
        spitfireMessages: msg
      })
    }
  }

  private newRestClient() {
    return new RestClient({
      name: 'Kuber',
      url: this.config.kuberRest,
      path: '/kuber/api/v1/spl'
    })
  }

  private getAllSpl(e, url: string) {
    e.preventDefault()
    this.restClient.get<{}>(null, jsonOpt, "")
      .then(json => { this.setState({restResponse: json})})
  }

  private addSpl(spl: {}) {
    this.restClient.post<{}>(spl, {}, jsonOpt, "")
      .then(json => { this.setState({restResponse: json})})
  }

  private getSpl(e, url: string) {
    e.preventDefault()
    this.restClient.get<{}>({}, jsonOpt, "name-1")
      .then(json => { this.setState({restResponse: json})})
  }

  private updateSpl(e, url: string) {
    e.preventDefault()
    this.restClient.put<{}>({
          name: 'name-1',
          tel: 'tel-11111111',
          email: 'email-11111111'
        }, {}, jsonOpt, "name-1")
      .then(json => { this.setState({restResponse: json})})
  }

  private deleteSpl(e, url: string) {
    e.preventDefault()
    this.restClient.delete<{}>({}, jsonOpt, "name-1")
      .then(json => { this.setState({restResponse: json})})
  }

  @autobind
  private onSubmit(values: {}): void {
    this.addSpl(values)
  }

}
