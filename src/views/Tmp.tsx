import * as React from 'react'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { CounterDispatchers, CounterProps, mapStateToPropsCounter, mapDispatchToPropsCounter } from '../actions/CounterActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

const styles = {
  backgroundColor : 'red',
  minHeight: '100%',
  width: '100%'
}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsCounter, mapDispatchToPropsCounter)
export default class Tmp extends React.Component<CounterProps & CounterDispatchers, any> {

  public render() {
    const { counter } = this.props
    return (
      <div className="container" style={ styles }>
        <div>Toastr</div>
        <button onClick={ (e) => this.onToastrClick(e) }>Click me</button>
        <div>Redux - Count = { counter.value }</div>
        <button onClick={ (e) => this.onReduxClick(e) }>Click me</button>
      </div>
    )
  }

  private onToastrClick(e) {
    e.preventDefault()
    toastr.success('Yeah...', '... you did it! Counter is now equal to ' + this.props.counter.value)
  }

  private onReduxClick(e) {
    e.preventDefault()
    this.props.dispatchIncrementAction(10)
  }

}
