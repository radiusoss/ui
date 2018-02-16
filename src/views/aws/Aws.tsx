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
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import ConfigApi from '../../api/config/ConfigApi'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

export type IAwsState = {
  config: IConfig
  volumes: any
  kuberWsResponse: Result<KuberResponse>
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Aws extends React.Component<any, IAwsState> {
  private config: IConfig = NotebookStore.state().config
  private restClient: RestClient
  private configApi: ConfigApi
  private k8sApi: KuberApi
  private action: string
  private wsMessage: any

  state = {
    config: emptyConfig,
    volumes: {},
    kuberWsResponse: null
  } 

  public constructor(props) {    
    super(props)
    this.k8sApi = window['KuberApi']
    this.configApi = window['ConfigApi'] 
  }

  public render() {
    return (
      <div>
        <div className="ms-font-su">Amazon AWS</div>
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
                        this.action = 'GET_EBS_VOLUMES'
                      }
                    }}
                    >
                    EBS Volumes
                  </FormConditionalSubmitButton>
                  <div style={{ padding: "10px", backgroundColor: "black" }}>
                    <JSONTree 
                      data={this.state.volumes} 
                      theme='greenscreen'
                      invertTheme={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </LayoutGroup>
        </Form>
      </div>
    )

  }

  public componentDidMount() {
    this.configApi = window['ConfigApi'] 
    this.k8sApi = window['KuberApi']
    this.setState({
      config: this.configApi.getConfig()
    })
  }

  @autobind
  private submit(values: any): void {
    this.restClient = new RestClient({
      name: 'KuberRestAws',
      url: this.config.kuberRest,
      path: '/kuber/api/v1/cloud/aws'
    })
    switch (this.action) {
      case 'GET_EBS_VOLUMES':
        this.restClient.get<{}>(values, jsonOpt, "/eu-central-1/volumes")
          .then(json => { this.setState({volumes: json})})
        break
    }
  }

}
