import * as React from 'react'
import { Slider } from 'office-ui-fabric-react/lib/Slider'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import KuberApi, { KuberResponse, loading } from '../../api/kuber/KuberApi'

@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ClusterCapacity extends React.Component<any, any> {
  private kuberApi: KuberApi

  state = {
    definition: null
  }

  public constructor(props) {
    super(props)
  }
  
  public render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row" style={{ maxWidth: "500px" }}>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Slider
                label='Number of Workers'
                min={ 0 }
                max={ 3 }
                step={ 1 }
                defaultValue={ 0 }
                showValue={ true }
                disabled={ false }
                onChange={ (value) => toastr.warning('Not yet available', 'Wait the new version to get ' + value + ' worker(s).') }
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

}
