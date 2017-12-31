import * as React from 'react'

export default class FabricIcon extends React.Component<any, any> {

  render() {
    return <i className={"ms-Icon ms-Icon--" + this.props.name} aria-hidden="true"></i>
  }
}
