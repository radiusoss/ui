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
export default class AWSCapacity extends React.Component<any, any> {
  private kuberApi: KuberApi

  public constructor(props) {
    super(props)
    var status = NotebookStore.state().kuberStatus
    if (status.clusterStatus) {
      if (status.clusterStatus.awsWorkerAutoscalingGroup) {
        var numberOfRunningInstances = 0
        if (status.clusterStatus.awsWorkerAutoscalingGroup.Instances) {
          numberOfRunningInstances = status.clusterStatus.awsWorkerAutoscalingGroup.Instances.length
        }
        this.state = {
          maxSize: status.clusterStatus.awsWorkerAutoscalingGroup.MaxSize,
          numberOfRunningInstances: numberOfRunningInstances
        }
      }
    }
    else {
      this.state = {
        maxSize: -1,
        numberOfRunningMasterInstances: 0,
        numberOfRunningWorkerInstances: 0
      }
    }
  }
  
  public render() {
    const { maxSize, numberOfRunningMasterInstances, numberOfRunningWorkerInstances } = this.state
    var numberOfRunningInstances = numberOfRunningMasterInstances + numberOfRunningWorkerInstances
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <div className="ms-fontSize-su">{numberOfRunningInstances} Cloud Instances</div>
            <div className="ms-fontSize-l">
                {numberOfRunningMasterInstances} running instance(s) to host the Kubernetes Master(s).
              </div>
              <div className="ms-fontSize-l">
                {numberOfRunningWorkerInstances} running instance(s) to host the Kubernetes Worker(s).
              </div>
            </div>
          </div>
          <div className="ms-Grid-row" style={{ maxWidth: '500px', marginTop: '20px' }}>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Slider
                label='Maximum Number of Cloud Instances for Kubernetes Workers.'
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
    if (status.clusterStatus) {
      if (status.clusterStatus.awsWorkerAutoscalingGroup) {
        var numberOfRunningMasterInstances = 0
        var numberOfRunningWorkerInstances = 0
        if (status.clusterStatus.awsMasterAutoscalingGroup.Instances) {
          numberOfRunningMasterInstances = status.clusterStatus.awsMasterAutoscalingGroup.Instances.length
        }
        if (status.clusterStatus.awsWorkerAutoscalingGroup.Instances) {
          numberOfRunningWorkerInstances = status.clusterStatus.awsWorkerAutoscalingGroup.Instances.length
        }
        this.setState({
          maxSize: status.clusterStatus.awsWorkerAutoscalingGroup.MaxSize,
          numberOfRunningMasterInstances: numberOfRunningMasterInstances,
          numberOfRunningWorkerInstances: numberOfRunningWorkerInstances
        })
      }
    }
  }

  private setMaxWorkerCloudInstances(size: number) {
    this.kuberApi.setMaxWorkerCloudInstances(size)
    toastr.warning('Kuber', `We have requested a cluster with ${size} instance worker(s).`)
  }

}
