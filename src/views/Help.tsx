import * as React from 'react'

import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Help extends React.Component<any, any> {

  render() {
    return (
      <div>
        <img src="/img/datalayer/pipes.svg"/>
      </div>
    )
  }

}
