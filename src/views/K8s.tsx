import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../store/NotebookStore'
import { IConfig, emptyConfig } from './../config/Config'
import { CompoundButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../util/rest/RestClient'
import { Form, FormConditionalSubmitButton, FormDatePicker, FormTextInput, Validators } from '@uifabric/experiments/lib/Form'
import { emailRegexp } from './../util/msc/regexp'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../actions/ConfigActions'
import { mapStateToPropsK8s, mapDispatchToPropsK8s } from '../actions/K8sActions'
import K8sApi  from '../api/k8s/K8sApi'
import JSONTree from 'react-json-tree'

export type IK8sState = {
    wsMessages: any[]
    restResponse: any
    formResults: any
    disabled: boolean
    checked: boolean
}

const MAX_LENGTH = 20

@connect(mapStateToPropsK8s, mapDispatchToPropsK8s)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class K8s extends React.Component<any, IK8sState> {
  private config: IConfig = NotebookStore.state().config
  private k8sApi: K8sApi
  private restClient: RestClient

  state = {
    wsMessages: new Array(),
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

        <h1>K8S</h1>
        
        <div className="callout m-0 py-h text-center bg-faded text-uppercase">
          <small><b>Received Messages</b></small>
        </div>
        {
          this.state.wsMessages.map((w) => {
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
                onClick =  { (e) => this.getAllSpl(e, this.config.kuberRest + "/api/v1/spl") }
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
                onClick = { (e) => this.getSpl(e, this.config.kuberRest + "/api/v1/spl/name-1") }
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
                onClick = { (e) => this.updateSpl(e, this.config.kuberRest + "/api/v1/spl/name-1") }
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
                onClick = { (e) => this.deleteSpl(e, this.config.kuberRest + "/api/v1/spl/name-1") }
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
    this.k8sApi = window['k8sApi']
//    this.k8sApi.command("/bin/ls")
  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (! isEqual(config, this.config)) {
      this.config = config
      this.restClient = this.newRestClient()
    }
    const { k8sMessageReceived } = nextProps
    if (k8sMessageReceived.op) {
      var msg = this.state.wsMessages
      if (msg.length > MAX_LENGTH) {
          msg = msg.slice(0, MAX_LENGTH - 1)
      }
//      msg.unshift(k8sMessageReceived.message)
      msg.unshift(k8sMessageReceived)
      this.setState({
        wsMessages: msg
      })
    }
  }

  private newRestClient() {
    return new RestClient({
      name: 'K8s',
      url: this.config.kuberRest,
      path: '/api/v1/spl'
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
