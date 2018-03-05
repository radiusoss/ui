import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import GoogleProfileWidget from './GoogleProfileWidget'
import GoogleUsers from './../users/GoogleUsers'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class GoogleProfile extends React.Component<any, any> {

  state = {
    contacts: []
  }

  public constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div style={{ overflowY: 'auto'}}>
        <GoogleProfileWidget />
        <hr/>
        <GoogleUsers />
      </div>
    )
  }

}
