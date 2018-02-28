import * as React from 'react'
import { Slider } from 'office-ui-fabric-react/lib/Slider'
import { NotebookStore } from './../../store/NotebookStore'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class CloudStatus extends React.Component<any, any> {
  private kuberApi: KuberApi

  public constructor(props) {
    super(props)
    var status = NotebookStore.state().kuberStatus
    if (status.cluster) {
      if (status.cluster.awsAutoscalingGroup) {
        var numberOfRunningInstances = 0
        if (status.cluster.awsAutoscalingGroup.Instances) {
          numberOfRunningInstances = status.cluster.awsAutoscalingGroup.Instances.length
        }
        this.state = {
          maxSize: status.cluster.awsAutoscalingGroup.MaxSize,
          numberOfRunningInstances: numberOfRunningInstances
        }
      }
    }
    else {
      this.state = {
        maxSize: -1,
        numberOfRunningInstances: -1
      }
    }
  }
  
  public render() {
    const { maxSize, numberOfRunningInstances } = this.state
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row" style={{ maxWidth: "500px" }}>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Slider
                label='Maximum Number of Cloud Instances'
                min={ 0 }
                max={ 10 }
                step={ 1 }
                defaultValue={ maxSize }
                showValue={ true }
                disabled={ false }
                onChange={ (size) => this.setMaxWorkerCloudInstances(size) }
                key={ maxSize }
              />
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div className="ms-fontSize-xxl">You currently have {numberOfRunningInstances} running cloud instance(s) to host your Kubernetes node(s).</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.kuberApi = window['KuberApi']
    this.kuberApi.status()
  }

  public componentWillReceiveProps(nextProps) {
    const { kuberMessageReceived } = nextProps
    if (kuberMessageReceived) {
      if (kuberMessageReceived.op == "KUBER_STATUS") {
        this.updateCapacityStatus(kuberMessageReceived)
      }
    }
  }

  private updateCapacityStatus(status) {
    if (status.cluster) {
      if (status.cluster.awsAutoscalingGroup) {
        var numberOfRunningInstances = 0
        if (status.cluster.awsAutoscalingGroup.Instances) {
          numberOfRunningInstances = status.cluster.awsAutoscalingGroup.Instances.length
        }
        this.setState({
          maxSize: status.cluster.awsAutoscalingGroup.MaxSize,
          numberOfRunningInstances: numberOfRunningInstances
        })
      }
    }
  }

  private setMaxWorkerCloudInstances(size: number) {
    this.kuberApi.setMaxWorkerCloudInstances(size)
    toastr.warning('Kuber', `We have requested a cluster with ${size} instance worker(s).`)
  }

}
