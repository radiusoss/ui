import * as React from 'react'
import { connect } from 'react-redux'
import HdfsApi from './../api/hdfs/HdfsApi'
import NotebookApi from './../api/notebook/NotebookApi'
import { ApplicationState } from '../state/State'
import { isAadAuthenticatedAction, AuthProps, AuthDispatchers, mapStateToPropsAuth, mapDispatchToPropsAuth  } from '../actions/AuthActions'
import { CounterDispatchers, CounterProps, mapStateToPropsCounter, mapDispatchToPropsCounter } from '../actions/CounterActions'
import { CounterLabelProp, System } from '../domain/Domain'
import { toastr } from 'react-redux-toastr'
import JSONTree from 'react-json-tree'
import { CommandButton } from 'office-ui-fabric-react/lib/Button';
import CodeBlock from '../components/CodeBlock'
import ExerciseCard from '../components/ExerciseCard'
import { TextFieldBasicExample } from 'office-ui-fabric-react/lib/components/TextField/examples/TextField.Basic.Example'
import { TextFieldErrorMessageExample } from 'office-ui-fabric-react/lib/components/TextField/examples/TextField.ErrorMessage.Example'
import * as stylesImport from '../components/CodeBlock.module.scss'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { NumberTextField } from 'office-ui-fabric-react/lib/components/TextField/examples/NumberTextField';
import { NotebookProps, mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'
import { SpitfireResponse } from '../api/spitfire/SpitfireApi'
import * as note from '../resources/note.json'
import * as svg from '../resources/azure.svg'

const styles: any = stylesImport
const TextFieldBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/TextField/examples/TextField.Basic.Example.tsx') as string
const TextFieldErrorMessageExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/TextField/examples/TextField.ErrorMessage.Example.tsx') as string

export interface CheckState {
  hdfsStatuses: any
  ticket: SpitfireResponse
  version: SpitfireResponse
  kerberosWho: string
}

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsCounter, mapDispatchToPropsCounter)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class Counter extends React.Component<CounterProps & CounterDispatchers & AuthProps & AuthDispatchers & CounterLabelProp & NotebookProps, System & CheckState> {
  private hdfsApi: HdfsApi
  private notebookApi: NotebookApi

  state = {
    ip: 'unknown',
    restResponse: {},
    wsResponse: {},
    hdfsStatuses: {},
    ticket: { 
      status: "OK",
      message: "",
      body: {
        principal: ""
      }
    },
    version: {},
    kerberosWho: ''
  }

  public constructor(props) {
    super(props)
    this.hdfsApi = new HdfsApi(props)
    this.notebookApi = window["NotebookApi"]
    this.getErrorMessagePromise = this.getErrorMessagePromise.bind(this)
  }

  private setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    })
  }
  
  public async componentDidMount() {

    const res = await fetch('https://api.ipify.org?format=json')
    const { ip } = await res.json()
    this.setState({ ip: ip })

    const kerberosRest = await fetch('http://localhost:8091/who')
    const kerberosWho = await kerberosRest.text()
    this.setState({ kerberosWho: kerberosWho })

    var hdfsStatuses = await this.hdfsApi.listStatus("/")
    this.setState({ hdfsStatuses: hdfsStatuses.result })

    var ticket = await this.notebookApi.ticket()
    this.setState({ ticket: ticket.result })

    var version = await this.notebookApi.version()
    this.setState({ version: version.result })

    this.notebookApi = window['NotebookApi']
    this.notebookApi.listNotes()

  }

  public componentWillReceiveProps(nextProps) {
    console.dir(nextProps)
  }

  public render() {

    const { counter, label, isSavingCounter, isLoadingCounter, errorCounter, isAadAuthenticated, aadToken, webSocketMessageReceived } = this.props
    const { hdfsStatuses, ticket, ip, version, kerberosWho } = this.state

    return (

      <div>

        <h1>Check</h1>

        <hr/>
        
        <div>My IP address is { ip }</div>

        <hr/>

        <div>
          <h3>Spitfire</h3>
          <div>Ticket: { JSON.stringify(ticket) }</div>
          <div>+ Status: { ticket.status } - Message: { ticket.message } - Principal: { ticket.body.principal }</div>
          <div>Version: { JSON.stringify(version) }</div>
          <div>Check Web Socket Message Received: { JSON.stringify(webSocketMessageReceived) }</div>
          <div>+ op: { webSocketMessageReceived.op }</div>
          <div>KerberosWho: { kerberosWho }</div>
        </div>

        <hr/>

        <div>
          <h3>Hdfs Statuses</h3>
          <div>JSON: { JSON.stringify(hdfsStatuses) }</div>
        </div>

        <hr/>

        <button ref='login' onClick={ (e) => this.onLoginClick(e) }>isAadAuthenticated={String(isAadAuthenticated)}</button>
{
/*
aadToken={JSON.stringify(aadToken)}
*/
}
        <hr/>

        <button onClick={ (e) => this.onToastrClick(e) }>Toastr</button>

        <hr/>
        
        <div style={{ display: this.props.isLoadingCounter ? 'block' : 'none' }}>Loading...</div>

        <form>
          <legend>{label}</legend>
          <pre>{JSON.stringify({ counter, isSavingCounter, isLoadingCounter }, null, 2)}</pre>
          <button ref='increment' onClick={ this.onClickIncrement }>+1</button>
          <button ref='save' disabled={ isSavingCounter } onClick={ this.onClickSave }>{ isSavingCounter ? 'saving...' : 'save' }</button>
          <button ref='load' disabled={ isLoadingCounter } onClick={ this.onClickLoad }>{ isLoadingCounter ? 'loading...' : 'load' }</button>
          <button ref='reset' disabled={ isSavingCounter || isLoadingCounter } onClick={ this.onClickReset }>{ ( isSavingCounter || isLoadingCounter) ? 'busy...' : 'reset' }</button>
          { errorCounter ? <div className='errorCounter'>{ errorCounter }</div> : null }
        </form>

        <hr/>
        
        <h2>Spitfire REST Request</h2>
        <button onClick={ () => this.onSpitfireVersionClick() }>Get Version</button>
        <button onClick={ () => this.onSpitfireTicketClick() }>Get Ticket</button>

        <h2>Spitfire WebSocket Request</h2>
        <button onClick={ () => this.onSpitfireListNotesClick() }>List Notes</button>

        <hr/>
        
        <h2>Spitfire Rest Response</h2>
        <div style={{ padding: "10px", backgroundColor: "black" }}>
          <JSONTree 
            data={this.state.restResponse} 
            theme='greenscreen'
            invertTheme={false}
          />
        </div>

        <h2>Spitfire WebSocket Response</h2>
        <div style={{ padding: "10px", backgroundColor: "black" }}>
          <JSONTree 
            data={this.state.wsResponse} 
            theme='greenscreen'
            invertTheme={false}
          />
        </div>

        <hr/>

        { (note as any).config.personalizedMode }
        <JSONTree 
            data={note}
            theme='greenscreen'
            invertTheme={false}
          />

        <hr/>
{/*        
        <ol className={ styles.steps }>
          <li>
            <p>To install the Fabric React NPM package, from the root of your project, run:</p>
            <CodeBlock language='bash' isLightTheme={ true }>
              {
                `npm --save install office-ui-fabric-react`
              }
            </CodeBlock>
          </li>
          <li>
            <p>With office-ui-fabric-react as a dependency in your package.json file, you can now start using components and styling. To reference a component, import it and use it in your render method:</p>
            <CodeBlock language='R' isLightTheme={ true }>
              { 
                `print(sample(1:3))
print(sample(1:3, size=3, replace=FALSE))  # same as previous line
print(sample(c(2,5,3), size=4, replace=TRUE)
print(sample(1:2, size=10, prob=c(1,3), replace=TRUE))
`.replace(/\t/g, '')

               }
            </CodeBlock>
            <p>For more information about using components, check out the <a href='#/components/'>components page</a>.</p>
          </li>
          <li>
            <p>You can also reference type styles for any text element:</p>
            <CodeBlock language='html' isLightTheme={ true }>
              {
                `<span class="ms-font-su ms-fontColor-themePrimary">Big blue text</span>`
              }
            </CodeBlock>
          </li>
          <li>
            <p>Reference icons by using the appropriate icon classes:</p>
            <CodeBlock language='html' isLightTheme={ true }>
              {
                `<i class="ms-Icon ms-Icon--Mail" aria-hidden="true"></i>`
              }
            </CodeBlock>
            <p>Components, type, and icons are just a small part of what Fabric has to offer. To reference other assets, including colors, product symbols, and more, see the <a href='#style/Styles'>styles page</a>.</p>
          </li>
        </ol>
        
        <ExerciseCard title='TextField variations' code={ TextFieldBasicExampleCode } language="javascript">
            <TextFieldBasicExample />
        </ExerciseCard>
*/}
        <TextField
          label='TextField with a string-based validator. Hint: the length of the input string must be less than 3.'
          onGetErrorMessage={ this._getErrorMessage }
        />
        <TextField
          label='TextField with a Promise-based validator. Hint: the length of the input string must be less than 3.'
          onGetErrorMessage={ this.getErrorMessagePromise }
        />
        <TextField
          label='TextField with a string-based validator. Hint: the length of the input string must be less than 3.'
          value='It should show an error message under this error message on render.'
          onGetErrorMessage={ this._getErrorMessage }
        />
        <TextField
          label='TextField with a string-based validator. Hint: the length of the input string must be less than 3.'
          value='It will run validation only on input change and not on render.'
          onGetErrorMessage={ this._getErrorMessage }
          validateOnLoad={ false }
        />
        <TextField
          label='TextField with a Promise-based validator. Hint: the length of the input string must be less than 3.'
          value='It should show an error message under this error message 5 seconds after render.'
          onGetErrorMessage={ this.getErrorMessagePromise }
        />
        <TextField
          label='TextField has both description and error message.'
          value='It should show description and error message on render at the same time.'
          description='This field has description and error message both under the input box.'
          onGetErrorMessage={ this._getErrorMessage }
        />
        <TextField
          label='TextField with a string-based validator. Hint: the length of the input string must be less than 3.'
          placeholder='Validation will start after users stop typing for 2 seconds.'
          onGetErrorMessage={ this._getErrorMessage }
          deferredValidationTime={ 2000 }
        />
        <TextField
          label='TextField that validates only on focus and blur. Hint: the length of the input string must be less than 3.'
          placeholder='Validation will start only on input focus and blur'
          onGetErrorMessage={ this._getErrorMessage }
          validateOnFocusIn
          validateOnFocusOut
        />
        <TextField
          label='TextField that validates only on blur. Hint: the length of the input string must be less than 3.'
          placeholder='Validation will start only on input blur.'
          onGetErrorMessage={ this._getErrorMessage }
          validateOnFocusOut
        />
        <TextField
          label='TextField that uses the errorMessage property to set an error state.'
          placeholder='This field always has an error.'
          errorMessage='This is a statically set error message.'
        />
        <NumberTextField
          label='Number TextField with valid initial value'
          initialValue='100'
        />
        <NumberTextField
          label='Number TextField with invalid initial value'
          initialValue='Not a number'
        />

        <hr/>
        
        <div dangerouslySetInnerHTML={ this.svg() } />

        <hr/>
        
        <table className="table table-hover table-outline mb-0 hidden-sm-down">
          <thead className="thead-default">
            <tr>
              <th className="text-center"><i className="icon-people"></i></th>
              <th>User</th>
              <th className="text-center">Country</th>
              <th>Usage</th>
              <th className="text-center">Payment Method</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">
                <div className="avatar">
                  <img src={'img/avatars/1.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-success"></span>
                </div>
              </td>
              <td>
                <div>Yiorgos Avraamu</div>
                <div className="small text-muted">
                  <span>New</span> | Registered: Jan 1, 2015
                </div>
              </td>
              <td className="text-center">
                <img src={'img/flags/USA.png'} alt="USA" style={{height: 24 + 'px'}}/>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>50%</strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                  </div>
                </div>
                <div className="progress progress-xs">
                   <div className="progress-bar bg-success" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{ "width": "50%" }}></div>
                </div>
              </td>
              <td className="text-center">
                <i className="fa fa-cc-mastercard" style={{fontSize: 24 + 'px'}}></i>
              </td>
              <td>
                <div className="small text-muted">Last login</div>
                <strong>10 sec ago</strong>
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <div className="avatar">
                  <img src={'img/avatars/2.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-danger"></span>
                </div>
              </td>
              <td>
                <div>Avram Tarasios</div>
                <div className="small text-muted">

                  <span>Recurring</span> | Registered: Jan 1, 2015
                </div>
              </td>
              <td className="text-center">
                <img src={'img/flags/Brazil.png'} alt="Brazil" style={{height: 24 + 'px'}}/>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>10%</strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                  </div>
                </div>
                <div className="progress progress-xs">
                <div className="progress-bar" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style={{ "width": "10%" }}></div>
                </div>
              </td>
              <td className="text-center">
                <i className="fa fa-cc-visa" style={{fontSize: 24 + 'px'}}></i>
              </td>
              <td>
                <div className="small text-muted">Last login</div>
                <strong>5 minutes ago</strong>
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <div className="avatar">
                  <img src={'img/avatars/3.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-warning"></span>
                </div>
              </td>
              <td>
                <div>Quintin Ed</div>
                <div className="small text-muted">
                  <span>New</span> | Registered: Jan 1, 2015
                </div>
              </td>
              <td className="text-center">
                <img src={'img/flags/India.png'} alt="India" style={{height: 24 + 'px'}}/>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>74%</strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                  </div>
                </div>
                <div className="progress progress-xs">
                <div className="progress-bar" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style={{ "width": "10%" }}></div>
                </div>
              </td>
              <td className="text-center">
                <i className="fa fa-cc-stripe" style={{fontSize: 24 + 'px'}}></i>
              </td>
              <td>
                <div className="small text-muted">Last login</div>
                <strong>1 hour ago</strong>
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <div className="avatar">
                  <img src={'img/avatars/4.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-default"></span>
                </div>
              </td>
              <td>
                <div>Enéas Kwadwo</div>
                <div className="small text-muted">
                  <span>New</span> | Registered: Jan 1, 2015
                </div>
              </td>
              <td className="text-center">
                <img src={'img/flags/France.png'} alt="France" style={{height: 24 + 'px'}}/>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>98%</strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                  </div>
                </div>
                <div className="progress progress-xs">
                <div className="progress-bar bg-info" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style={{ "width": "10%" }}></div>
                </div>
              </td>
              <td className="text-center">
                <i className="fa fa-paypal" style={{fontSize: 24 + 'px'}}></i>
              </td>
              <td>
                <div className="small text-muted">Last login</div>
                <strong>Last month</strong>
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <div className="avatar">
                  <img src={'img/avatars/5.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-success"></span>
                </div>
              </td>
              <td>
                <div>Agapetus Tadeáš</div>
                <div className="small text-muted">
                  <span>New</span> | Registered: Jan 1, 2015
                </div>
              </td>
              <td className="text-center">
                <img src={'img/flags/Spain.png'} alt="Spain" style={{height: 24 + 'px'}}/>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>22%</strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                  </div>
                </div>
                <div className="progress progress-xs">
                <div className="progress-bar bg-danger" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style={{ "width": "10%" }}></div>
                </div>
              </td>
              <td className="text-center">
                <i className="fa fa-google-wallet" style={{fontSize: 24 + 'px'}}></i>
              </td>
              <td>
                <div className="small text-muted">Last login</div>
                <strong>Last week</strong>
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <div className="avatar">
                  <img src={'img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-danger"></span>
                </div>
              </td>
              <td>
                <div>Friderik Dávid</div>
                <div className="small text-muted">
                  <span>New</span> | Registered: Jan 1, 2015
                </div>
              </td>
              <td className="text-center">
                <img src={'img/flags/Poland.png'} alt="Poland" style={{height: 24 + 'px'}}/>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>43%</strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                  </div>
                </div>
                <div className="progress progress-xs">
                <div className="progress-bar bg-success" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style={{ "width": "10%" }}></div>
                </div>
              </td>
              <td className="text-center">
                <i className="fa fa-cc-amex" style={{fontSize: 24 + 'px'}}></i>
              </td>
              <td>
                <div className="small text-muted">Last login</div>
                <strong>Yesterday</strong>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    )

  }

  private svg() {
    return {__html: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' + (svg as any).content + '</svg>'}
  }

  private onClickIncrement = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.dispatchIncrementAction(1)
  }

  private onClickSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isSavingCounter) {
      this.props.dispatchSaveAction(this.props.counter.value)
    }
  }

  private onClickLoad = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isLoadingCounter) {
      this.props.dispatchLoadAction()
    }
  }

  private onClickReset = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if ((!this.props.isSavingCounter) && (!this.props.isLoadingCounter)) {
      this.props.dispatchResetAction()
    }
  }

  private onLoginClick = (e: React.SyntheticEvent<HTMLButtonElement>) =>  {
    e.preventDefault()
    if (this.props.isAadAuthenticated) {
     this.props.dispatchLogoutAction()
     this.props.dispatchAadTokenAction({"fake": true})
    } 
    else {
     this.props.dispatchIsAadAuthenticatedAction()
     this.props.dispatchAadTokenAction({"oauth": "test"})
    }
  }

  private onSpitfireVersionClick() {

    fetch(this.getApiUrl() + '/version', {
      method: "GET",
//      body: JSON.stringify({name: "name"}),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .then(response => response.json()
        .then(json => { this.setState({restResponse: json})
    }))
  }

  private onSpitfireTicketClick() {
    fetch(this.getApiUrl() + `/security/ticket`) 
      .then(response => response.json()
        .then(json => { this.setState({restResponse: json})
    }))
  }

  private getApiUrl() {    
    let protocol = window.location.protocol == 'https:' ? 'https://' : 'http://'
    let host = window.location.hostname
    let port = (window.location.port  == '4320' || window.location.port  == '4322' || window.location.port  == '4323') ? ':' + '8091' : (window.location.port  == '' ? '' : ':' + window.location.port  )
    let path = '/api'
    return protocol + host + port + path
  }

  private onSpitfireListNotesClick() {
    this.notebookApi.listNotes()
  }

  private onToastrClick(e) {
    toastr.success('Yeah...', '... you did it! Counter is now equal to ' + this.props.counter.value)
  }

  private _getErrorMessage(value: string): string {
    return value.length < 3
      ? ''
      : `The length of the input value should less than 3, actual is ${value.length}.`;
  }

  private getErrorMessagePromise(value: string): Promise<string> {
    return new Promise((resolve) => {
      // resolve the promise after 3 second.
      setTimeout(() => resolve(this._getErrorMessage(value)), 5000);
    });
  }

}
