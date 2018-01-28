import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class Page500 extends React.Component<any, any> {
  public render() {
    console.log("Error 500 for location", location)
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-2">500</h1>
              <h4 className="pt-1">Houston, we have a problem!</h4>
              <p className="text-muted">The page you are looking for is temporarily unavailable.</p>
            </div>
            <div className="input-prepend input-group">
              <span className="input-group-addon"><i className="fa fa-search"></i></span>
              <input className="form-control" size={16} type="text" placeholder="What are you looking for?" />
              <span className="input-group-btn">
                <button className="btn btn-info" type="button">Search</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
