import * as React from 'react'
import { connect } from 'react-redux'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class Login extends React.Component<AuthDispatchers & AuthProps, any> {

  public constructor(props) {
    super(props)
  }

  public render() {
    const { isMicrosoftAuthenticated } = this.props
    return (
      <div>
        <button ref='login' >isMicrosoftAuthenticated={String(isMicrosoftAuthenticated)}</button>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">
                <div className="card p-2">
                  <div className="card-block">
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your Spitfire account</p>
                    <div className="input-group mb-1">
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                      <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group mb-2">
                      <span className="input-group-addon"><i className="icon-lock"></i></span>
                      <input type="password" className="form-control" placeholder="Password"/>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-addon"><i className="icon-ghost"></i></span>
                      <input type="text" className="form-control" placeholder="Host"/>
                      <span className="input-group-addon"><i className="icon-drop"></i></span>
                      <input type="text" className="form-control" placeholder="Port"/>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button type="button" className="btn btn-primary px-2">Login</button>
                      </div>
                      <div className="col-6 text-right">
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card card-inverse card-primary py-3 hidden-md-down" style={{ width: 44 + '%' }}>
                  <div className="card-block text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <button type="button" className="btn btn-primary active mt-1">Register Now!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       </div>
     )

  }

  private handleValidSubmit(event, values) {
    alert(values.host)
  }

  private handleInvalidSubmit(event, errors, values) {
    alert(values.host)
  }

}
