import * as React from 'react'
import Spinner from './_widget/Spinner'
import history from './../routes/History'
import { connect } from 'react-redux'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'
import AadApi from '../api/microsoft/AadApi'
import * as queryString from 'query-string'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class OAuthCallbackTwitter extends React.Component<AuthDispatchers & AuthProps, any> {
  private aadApi: AadApi

  public constructor(props) {
    super(props)
    this.aadApi = window["aadApi"]
  }

  public render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-2">Hold on.</h1>
              <h4 className="pt-1">We are checking your profile...</h4>
            </div>
            <Spinner size={100} />
          </div>
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.checkProfile()
  }

  public componentDidUpdate(prevProps, prevState) {
//    this.checkProfile()
  }

  private checkProfile() {
    const parsedAuth = queryString.parse(location.hash.replace("#/twitter/auth?", ""))
    console.log("OAuth Callback Twitter", parsedAuth)
    history.push("/")
    this.props.dispatchIsTwitterAuthenticatedAction()
    this.props.dispatchTwitterTokenAction(parsedAuth.token)
  }

}
