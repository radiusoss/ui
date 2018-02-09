import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../../../actions/NotebookActions'

export default class TextRenderer extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  public render() {
    const { data } = this.props
    return (
      <div>
        <pre>
          {data}
        </pre>
      </div>      
    )
  }

}
