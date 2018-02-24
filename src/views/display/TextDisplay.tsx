import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'

export default class TextDisplay extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  public render() {
    const { data } = this.props
    return (
//      <pre style={{fontSize: '80%', margin: 0}}>
      <pre style={{fontSize: '90%', margin: 0}}>
        {data}
      </pre>
    )
  }

}
