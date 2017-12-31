import * as React from 'react'
import { connect } from 'react-redux'

export default class ImageRenderer extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  public render() {
    const { data } = this.props
    return (
      <div>
        <img src={`data:image/png;base64,${data as string}`} />
      </div>
    )
  }

}
