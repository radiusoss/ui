import * as React from 'react'
import { connect } from 'react-redux'

export default class HtmlRenderer extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  public render() {
    const { data } = this.props
    var html = {
      __html: data
    }
    return (
      <div>
        <div dangerouslySetInnerHTML={html}/>
      </div>
    )
  }

}
