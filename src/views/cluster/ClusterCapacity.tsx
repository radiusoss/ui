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
export default class ClusterCapacity extends React.Component<any, any> {
  private kuberApi: KuberApi

  public constructor(props) {
    super(props)
    if (NotebookStore.state().kuberStatus.cluster) {
      this.state = {
        maxSize: NotebookStore.state().kuberStatus.cluster.awsAutoscalingGroup.MaxSize,
        numberOfRunningInstances: NotebookStore.state().kuberStatus.cluster.awsAutoscalingGroup.Instances.length
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
                label='Maximum Number of Workers'
                min={ 1 }
                max={ 10 }
                step={ 1 }
                defaultValue={ maxSize }
                showValue={ true }
                disabled={ false }
                onChange={ (size) => this.setMaxWorkers(size) }
                key={ maxSize }
              />
              <div className="ms-fontSize-xl">{numberOfRunningInstances} RUNNING Worker(s)</div>
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
        console.log('---', kuberMessageReceived.cluster.awsAutoscalingGroup)
        this.setState({
          maxSize: kuberMessageReceived.cluster.awsAutoscalingGroup.MaxSize,
          numberOfRunningInstances: kuberMessageReceived.cluster.awsAutoscalingGroup.Instances.length
        })
      }
    }
  }

  private setMaxWorkers(size: number) {
    this.kuberApi.setMaxWorkers(size)
    toastr.warning('Kuber', `We have requested a ${size} worker(s) cluster.`)
  }

}
