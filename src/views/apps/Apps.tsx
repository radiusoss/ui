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
import KuberApi, { KuberResponse } from '../../api/kuber/KuberApi'

const MAX_LENGTH = 20

export type IKuberState = {
  apps: Result<KuberResponse>
}

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
export default class Apps extends React.Component<any, IKuberState> {
  private config: IConfig = NotebookStore.state().config
  private k8sApi: KuberApi
  private method: string

  state = {
    apps: null
  } 

  public constructor(props) {    
    super(props)
  }

  public async componentDidMount() {
    this.k8sApi = window['KuberApi']
  }

  public render() {
    return (
      <div>
        <div className="ms-font-su">Applications</div>
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
                        this.method = 'GET_APPS'
                      }
                    }}
                  >
                    Get Apps
                  </FormConditionalSubmitButton>
                </div>            
              </div>
              <div style={{ padding: "10px", backgroundColor: "black" }}>
                <JSONTree 
                  data={this.state.apps} 
                  theme='greenscreen'
                  invertTheme={false}
                />
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
  }

  @autobind
  private submit(values: any): void {
    switch (this.method) {
      case 'GET_APPS':
        this.k8sApi.getApps()
          .then(json => { this.setState({apps: json})})
        break
    }  
  }

}
