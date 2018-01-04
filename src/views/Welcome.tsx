import * as React from 'react'
import * as queryString from 'query-string'
import history from './../routes/History'
import { connect } from 'react-redux'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'
import { NotebookStore } from './../store/NotebookStore'
import { css } from 'office-ui-fabric-react/lib/Utilities'
import { CompoundButton } from 'office-ui-fabric-react/lib/Button'
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'
import NotebookApi from './../api/notebook/NotebookApi'
import MicrosoftApi from '../api/microsoft/MicrosoftApi'
import Highlights from './Highlights'
import * as stylesImport from './_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class Welcome extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private microsoftApi: MicrosoftApi

  state = {
    isAadAuthenticated: NotebookStore.state().isAadAuthenticated,
    isTwitterAuthenticated: NotebookStore.state().isTwitterAuthenticated,
    profileDisplayName: NotebookStore.state().profileDisplayName,
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob)
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["NotebookApi"]
    this.microsoftApi = window["MicrosoftApi"]
  }

  public render() {

    const { isAadAuthenticated, isTwitterAuthenticated, profileDisplayName, profilePhoto } = this.state

    return (

      <div>

        <div className={ styles.hero } style={{margin: '0px'}}>

          <h1 className={ styles.title }>Kuber Plane</h1>

          <span className={ styles.tagline }>Kuber is the easy way to create and manage your Big Data Science Platform on Kubernetes.</span>

          { (!isAadAuthenticated && !isTwitterAuthenticated) && 

            <div>
            
              <div className="ms-Grid" style={{ padding: 0 }}>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
                    <div className={ styles.tagline }>Choose your favorite sign-in method.</div>
                  </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 text-center">
                  <a href="#" className={ css(styles.button, styles.primaryButton) } onClick={ (e) => this.onAadAuthenticateClick(e) }>Microsoft</a>
                        <div className={ styles.version }>You need a valid Microsoft account.</div>
                    </div>
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 text-center">
                      <a href="#" className={ css(styles.button, styles.primaryButton) } onClick={ (e) => this.onTwitterAuthenticateClick(e) }>Twitter</a>
                      <div className={ styles.version }>You need a valid Twitter account.</div>
                    </div>
                </div>
              </div>

            </div>

          }

          { (isAadAuthenticated || isTwitterAuthenticated) && 
          
              <div className="ms-Grid">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
                    <div className={ styles.tagline }>Welcome { profileDisplayName }</div>
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
                    <a href="#" className={ css(styles.button, styles.primaryButton) } onClick={ (e) => this.onNotebookClick(e) }>Plane</a>
                  </div>
                  <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
                    <a href="#" className={ css(styles.button, styles.button) } onClick={ (e) => this.onLogoutClick(e) }>Logout</a>
                  </div>
                </div>
             </div>
                
            }

        </div>

        <div className={ styles.flavors } style={{margin: '0px'}}>

          <div className={ styles.flavor }>

            { (!isAadAuthenticated && !isTwitterAuthenticated) && 
              <img src={ 'img/datalayer/datalayer-square-white.png' } width='72' alt='Datalayer Logo' />
            }

            { (isAadAuthenticated || isTwitterAuthenticated) && 
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
                  <br/>
                  <Persona
                    imageUrl = { profilePhoto }
                    hidePersonaDetails = { true }
                    presence = { PersonaPresence.online }
                    size = { PersonaSize.large }
                    className = "text-center"
                   />
                </div>                
              </div>
            }

            <span className={ styles.flavorTitle }>Built to Scale</span>
            <span className={ styles.flavorDescription }>Datalayer&rsquo;s robust, up-to-date technology is built on Kubernetes, Apache Hadoop and Spark</span>
{/*
            <a href='#/components' className={ styles.button }>See components</a>
*/}
          </div>
          <div className={ styles.flavor }>
            <span className={ styles.flavorTitle }>Collect</span>
            <span className={ styles.flavorDescription }>Pull data from various data sources</span>
{/*
            <a href='#/fabric-js'>Learn more</a>
*/}
          </div>
          <div className={ styles.flavor }>
            <span className={ styles.flavorTitle }>Deploy</span>
            <span className={ styles.flavorDescription }>Apply your models on production data</span>
{/*
            <a href='#/angular-js'>Learn more</a>
*/}
          </div>
          <div className={ styles.flavor }>
            <span className={ styles.flavorTitle }>Model and Share</span>
            <span className={ styles.flavorDescription }>Apply algorithms and collaborate with peers</span>
{/*
            <a href='#/fabric-ios'>Learn more</a>
*/}
          </div>

        </div>

        <div className={ css(styles.product, styles.productSharepoint) } style={{margin: '0px'}}>
            <div>
              <span className={ styles.productTitle }>Collaborate</span>
              <span className={ styles.productDescription }>Share your Big Data analysis with peers in a visual way.</span>
            </div>
            <img className={ styles.productImage } src={ 'img/home/collaborate.svg' } width='496' height='300' alt='' />
        </div>

        <div className={ css(styles.product, styles.productAddins) } style={{margin: '0px'}}>
          <div>
            <span className={ styles.productTitle }>Enterprise ready</span>
            <span className={ styles.productDescription }>Integrate with Azure Security.</span>
          </div>
          <img className={ styles.productImage } src={ 'img/datalayer/pipes.svg' } width='496' height='300' alt='' />
        </div>

        <Highlights/>

      </div>

    )

  }

  public componentWillReceiveProps(nextProps) {
    const { isAadAuthenticated } = nextProps
    if ((this.state.isAadAuthenticated == true) && (isAadAuthenticated == false)) {
      this.microsoftApi.logout()
      this.setState({
        isAadAuthenticated: false,
        profileDisplayName: '',
        profilePhoto: 'img/datalayer/datalayer-square.png'
      })
    }
    else if ((this.state.isAadAuthenticated == false) && (isAadAuthenticated == true)) {
      var blobPhoto = NotebookStore.state().profilePhotoBlob
      var profilePhoto = window.URL.createObjectURL(blobPhoto)
      this.setState({
        isAadAuthenticated: true,
        profileDisplayName: NotebookStore.state().profileDisplayName,
        profilePhoto: profilePhoto
      })
    }
  }

  private onAadAuthenticateClick = (e) =>  {
    e.preventDefault()
    this.props.dispatchToAadAction()
  }

  private onTwitterAuthenticateClick = (e) =>  {
    e.preventDefault()
    this.props.dispatchToTwitterAction()
  }

  private onNotebookClick = (e) =>  {
    e.preventDefault()
    history.push("/dla/notes")
  }

  private onProfileClick = (e) =>  {
    e.preventDefault()
    history.push("/dla/profile")
  }

  private onLogoutClick = (e) =>  {
    e.preventDefault()
    window["MicrosoftApi"].logout()
    this.props.dispatchLogoutAction()
    history.push("/")
  }

}
