import * as React from 'react'
import * as isEqual from 'lodash.isequal'
import { connect } from 'react-redux'
import { NotebookStore } from '../../store/NotebookStore'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { RestClient, Result, Outcome, ClientOptions, jsonOpt } from '../../util/rest/RestClient'
import JSONTree from 'react-json-tree'
import { Slider } from 'office-ui-fabric-react/lib/Slider'
import { toastr } from 'react-redux-toastr'
import { emailRegexp } from './../../util/msc/regexp'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import { LayoutGroup } from '@uifabric/experiments/lib/LayoutGroup';
import { Form, FormConditionalSubmitButton, FormDatePicker, FormDropdown, FormCheckBox, FormTextInput, Validators } from '@uifabric/experiments/lib/Form'
import { CompoundButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import { mapStateToPropsK8S, mapDispatchToPropsK8S } from '../../actions/K8SActions'
import K8SApi, { K8SResponse, loading } from '../../api/k8s/K8SApi'

const MAX_LENGTH = 20

export type IK8SState = {
  clusterDef: Result<K8SResponse>,
  overview: Result<K8SResponse>
}

@connect(mapStateToPropsK8S, mapDispatchToPropsK8S)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Cluster extends React.Component<any, IK8SState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  private k8sApi: K8SApi
  private method: string

  state = {
    clusterDef: null,
    overview: null
  } 

  public constructor(props) {    
    super(props)
  }

  public async componentDidMount() {
    this.k8sApi = window['K8SApi']
  }

  public render() {
    return (
      <div>
        <br/>
        <h3>Cluster</h3>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <Slider
                label='Number of Workers'
                min={ 0 }
                max={ 3 }
                step={ 1 }
                defaultValue={ 3 }
                showValue={ true }
                onChange={ (value) => toastr.warning('Not yet available', 'Wait the new version to get ' + value + 'worker(s).') }
              />
            </div>
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
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
                            this.method = 'GET_CLUSTER_DEF'
                          }
                        }}
                      >
                        Get Cluster Definition
                      </FormConditionalSubmitButton>
                      <div style={{ padding: "10px", backgroundColor: "black" }}>
                        <JSONTree
                          data={this.state.clusterDef} 
                          theme='greenscreen'
                          invertTheme={false}
                        />
                      </div>
                    </div>
                    <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-clearfix">
                      <FormConditionalSubmitButton
                        buttonProps={{
                          onClick: (e) => {
                            this.method = 'GET_OVERVIEW'
                          }
                        }}
                      >
                        Get Cluster Overview
                      </FormConditionalSubmitButton>
                      <div style={{ padding: "10px", backgroundColor: "black" }}>
                        <JSONTree
                          data={this.state.overview} 
                          theme='greenscreen'
                          invertTheme={false}
                        />
                      </div>
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
              </LayoutGroup>
            </Form>
            </div>
          </div>
        </div>
      </div>
    )

  }

  public componentWillReceiveProps(nextProps) {
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
  }

  @autobind
  private submit(values: any): void {
    switch (this.method) {
      case 'GET_CLUSTER_DEF':
        this.setState({clusterDef: loading})
        this.k8sApi.getClusterDef()
          .then(json => { this.setState({clusterDef: json})})
        break
      case 'GET_OVERVIEW':
      this.setState({overview: loading})
      this.k8sApi.getOverview()
          .then(json => { this.setState({overview: json})})
        break
    }
  }

}
