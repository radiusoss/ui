import * as React from 'react'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { CounterDispatchers, CounterProps, mapStateToPropsCounter, mapDispatchToPropsCounter } from './../../../actions/CounterActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsCounter, mapDispatchToPropsCounter)
export default class D3Spl extends React.Component<any, any> {

  public render() {
    return (
      <div>
      </div>
    )
  }

  public componentDidMount () {
  }

}
