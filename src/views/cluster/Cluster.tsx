import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsK8s, mapDispatchToPropsK8s } from '../../actions/K8sActions'
import { IConfig, emptyConfig } from './../../config/Config'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { emailRegexp } from './../../util/msc/regexp'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { LayoutGroup } from '@uifabric/experiments/lib/LayoutGroup';
import { Form, FormConditionalSubmitButton, FormDatePicker, FormDropdown, FormCheckBox, FormTextInput, Validators } from '@uifabric/experiments/lib/Form'
import { CompoundButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import K8sApi from '../../api/k8s/K8sApi'

const MAX_LENGTH = 20

export type IK8sState = {
  wsMessages: any[]
  restResponse: any
  formResults: any
  disabled: boolean
  checked: boolean
}

@connect(mapStateToPropsK8s, mapDispatchToPropsK8s)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Cluster extends React.Component<any, IK8sState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  private k8sApi: K8sApi
  private method: string
  private url: string
  private wsMessage: any

  state = {
    wsMessages: new Array(),
    restResponse: {},
    formResults: null,
    disabled: false,
    checked: false
  } 

  public constructor(props) {    
    super(props)
  }

  public async componentDidMount() {
    this.k8sApi = window['k8sApi']
  }

  public render() {

    const { disabled, checked } = this.state

    return (

      <div>

        <br/>
        <h3>Kubernetes Cluster</h3>

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
                        this.url = 'http://localhost:9091/api/v1/cluster?filterBy=&itemsPerPage=10&name=&namespace=&page=1&sortBy=d,creationTimestamp'
                      }
                    }}
                  >
                    GET K8S Cluster
                  </FormConditionalSubmitButton>
                  <br/>
                  <br/>
                  <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'GET'
                        this.url = 'http://localhost:9091/api/v1/overview?filterBy=&itemsPerPage=10&name=&page=1&sortBy=d,creationTimestamp'
                      }
                    }}
                  >
                    GET K8S Overview
                  </FormConditionalSubmitButton>
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-clearfix">
                {/*
                  <FormConditionalSubmitButton
                    buttonProps={{
                      onClick: (e) => {
                        this.method = 'WS'
                        this.wsMessage = this.k8sApi.CREATE_CLUSTER_DEF()
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
                          this.wsMessage = this.k8sApi.CREATE_CLUSTER()
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
                          this.wsMessage = this.k8sApi.DELETE_CLUSTER()
                        }
                      }}
                    >
                    WS Delete Cluster
                  </FormConditionalSubmitButton>
                    */}
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
    const { config, k8sMessageReceived } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
    if (k8sMessageReceived && k8sMessageReceived.op) {
      if (k8sMessageReceived.op != "PING") {
        var msg = this.state.wsMessages
        if (msg.length > MAX_LENGTH) {
            msg = msg.slice(0, MAX_LENGTH - 1)
        }
        msg.unshift(new Date().toTimeString() + ' - ' + JSON.stringify(k8sMessageReceived))
        this.setState({
          wsMessages: msg
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
      this.k8sApi.send(this.wsMessage)
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
